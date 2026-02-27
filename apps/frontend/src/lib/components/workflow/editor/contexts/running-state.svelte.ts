import type { OnNodeRunning, NodeRunningParams, NodeRunStatus, NodeRunData } from '$lib/components/workflow/types/index';
import { workflowState } from './workflow-state/index.svelte';

export type { NodeRunStatus };

/**
 * 响应式运行状态管理
 * 
 * 全局状态：记录当前运行状态（是否运行中、当前节点、测试模式）
 * 节点状态：持久化到节点的 _run data 中，不会因为运行其他节点而丢失
 */
function createRunningState() {
	// 运行回调函数
	let onNodeRunning = $state<OnNodeRunning | undefined>(undefined);
	
	// 全局运行状态
	let isRunning = $state(false);
	let isTestMode = $state(false);
	
	// 当前正在运行的节点 ID
	let currentNodeId = $state<string | null>(null);
	
	// 中断控制器
	let abortController = $state<AbortController | null>(null);

	/** 更新节点的 _run 数据 */
	function updateNodeRunData(nodeId: string, runData: NodeRunData) {
		workflowState.nodes = workflowState.nodes.map(n =>
			n.id === nodeId
				? { ...n, data: { ...n.data, _run: runData } }
				: n
		);
	}

	/** 获取节点的 _run 数据 */
	function getNodeRunData(nodeId: string): NodeRunData | undefined {
		const node = workflowState.getNode(nodeId);
		return node?.data?._run;
	}

	/** 清除所有节点的 _run 数据 */
	function clearAllNodeRunData() {
		workflowState.nodes = workflowState.nodes.map(n => {
			if (n.data._run) {
				const { _run, ...restData } = n.data;
				return { ...n, data: restData };
			}
			return n;
		});
	}

	return {
		// Getters
		get onNodeRunning() { return onNodeRunning; },
		get isRunning() { return isRunning; },
		get isTestMode() { return isTestMode; },
		get currentNodeId() { return currentNodeId; },
		get abortSignal() { return abortController?.signal; },

		// Setters
		set onNodeRunning(v: OnNodeRunning | undefined) { onNodeRunning = v; },

		/** 获取节点运行状态（从节点 data 读取）*/
		getNodeStatus(nodeId: string): NodeRunStatus {
			return getNodeRunData(nodeId)?.status ?? 'idle';
		},

		/** 获取节点运行数据（从节点 data 读取）*/
		getNodeRunData(nodeId: string): NodeRunData | undefined {
			return getNodeRunData(nodeId);
		},

		/** 开始工作流运行（不清除节点状态） */
		startRun(isTest: boolean = false) {
			isRunning = true;
			isTestMode = isTest;
			abortController = new AbortController();
		},

		/** 结束工作流运行 */
		endRun() {
			isRunning = false;
			currentNodeId = null;
			abortController = null;
		},
		
		/** 中断运行 */
		abort() {
			if (abortController) {
				abortController.abort();
			}
			// 将当前运行中的节点标记为错误
			if (currentNodeId) {
				const existing = getNodeRunData(currentNodeId);
				if (existing?.status === 'running') {
					const endTime = Date.now();
					updateNodeRunData(currentNodeId, {
						...existing,
						status: 'error',
						endTime,
						elapsed: endTime - (existing.startTime ?? endTime),
						error: '执行已取消'
					});
				}
			}
			this.endRun();
		},
		
		/** 检查是否已中断 */
		isAborted(): boolean {
			return abortController?.signal.aborted ?? false;
		},

		/** 设置节点等待运行 */
		setNodeWaiting(nodeId: string) {
			updateNodeRunData(nodeId, { status: 'waiting' });
		},

		/** 设置节点开始运行 */
		setNodeRunning(nodeId: string, input?: unknown) {
			currentNodeId = nodeId;
			const startTime = Date.now();
			updateNodeRunData(nodeId, {
				status: 'running',
				startTime,
				inputs: input as Record<string, unknown> | undefined
			});
		},

		/** 更新节点运行输入（用于存储解析后的输入） */
		updateNodeRunInputs(nodeId: string, inputs: Record<string, unknown>) {
			const existing = getNodeRunData(nodeId);
			if (existing) {
				updateNodeRunData(nodeId, {
					...existing,
					inputs
				});
			}
		},

		/** 设置节点运行成功 */
		setNodeSuccess(nodeId: string, output?: unknown, tokens?: NodeRunData['tokens']) {
			const existing = getNodeRunData(nodeId);
			const endTime = Date.now();
			const startTime = existing?.startTime ?? endTime;
			
			updateNodeRunData(nodeId, {
				status: 'success',
				startTime,
				endTime,
				elapsed: endTime - startTime,
				inputs: existing?.inputs,
				outputs: output as Record<string, unknown> | undefined,
				tokens
			});
			
			if (currentNodeId === nodeId) {
				currentNodeId = null;
			}
		},

		/** 设置节点运行失败 */
		setNodeError(nodeId: string, error: string) {
			const existing = getNodeRunData(nodeId);
			const endTime = Date.now();
			const startTime = existing?.startTime ?? endTime;
			
			updateNodeRunData(nodeId, {
				status: 'error',
				startTime,
				endTime,
				elapsed: endTime - startTime,
				inputs: existing?.inputs,
				error
			});
			
			if (currentNodeId === nodeId) {
				currentNodeId = null;
			}
		},

		/** 执行单个节点 */
		async runNode(nodeId: string, nodeType: string, input: unknown): Promise<unknown> {
			if (!onNodeRunning) {
				throw new Error('onNodeRunning callback not provided');
			}
			
			// 检查是否已中断
			if (this.isAborted()) {
				throw new Error('执行已取消');
			}

			this.setNodeRunning(nodeId, input);

			try {
				const params: NodeRunningParams = {
					nodeType,
					input,
					isTest: isTestMode
				};
				const output = await onNodeRunning(params);
				this.setNodeSuccess(nodeId, output);
				return output;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				this.setNodeError(nodeId, errorMessage);
				throw error;
			}
		},

		/** 清除所有节点的运行状态 */
		clearAllRunStatus() {
			clearAllNodeRunData();
		},

		/** 清除单个节点的运行状态 */
		clearNodeRunStatus(nodeId: string) {
			const node = workflowState.getNode(nodeId);
			if (node?.data?._run) {
				const { _run, ...restData } = node.data;
				workflowState.nodes = workflowState.nodes.map(n =>
					n.id === nodeId ? { ...n, data: restData } : n
				);
			}
		},

		/** 重置全局运行状态（不清除节点状态） */
		reset() {
			isRunning = false;
			isTestMode = false;
			currentNodeId = null;
			abortController = null;
		},

		/** 完全重置（包括清除所有节点状态） */
		fullReset() {
			this.reset();
			clearAllNodeRunData();
		}
	};
}

// 全局单例
export const runningState = createRunningState();
