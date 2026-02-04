<script lang="ts">
  import { SvelteFlow, type NodeTypes, type EdgeTypes, type Node, type Edge, type Connection } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import { setContext } from 'svelte';

  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
  import IconTransform from '@iconify-svelte/tdesign/transform';
  import IconHelpCircle from '@iconify-svelte/tdesign/help-circle';
  import IconCalculator from '@iconify-svelte/tdesign/calculator';
  import IconCompare from '@iconify-svelte/tdesign/contrast';
  import IconLogic from '@iconify-svelte/tdesign/fork';
  import IconTextFormatting from '@iconify-svelte/tdesign/textbox';
  import IconList from '@iconify-svelte/tdesign/view-list';
  import IconTools from '@iconify-svelte/tdesign/tools';
  import IconBranch from '@iconify-svelte/tdesign/git-branch';
  import IconAssign from '@iconify-svelte/tdesign/assignment';
  import IconLayout from '@iconify-svelte/tdesign/layout';
  import IconArrowRight from '@iconify-svelte/tdesign/arrow-right';
  import IconArrowDown from '@iconify-svelte/tdesign/arrow-down';
  import IconBug from '@iconify-svelte/tdesign/bug';
  import IconCondition from '@iconify-svelte/tdesign/filter';
  import IconLoop from '@iconify-svelte/tdesign/refresh';
  import ActionNode from './ActionNode.svelte';
  import StartNode from './StartNode.svelte';
  import UtilNode from './UtilNode.svelte';
  import VariablePoolNode from './VariablePoolNode.svelte';
  import AssignNode from './AssignNode.svelte';
  import ConditionNode from './ConditionNode.svelte';
  import LoopNode from './LoopNode.svelte';
  import LoopBodyNode from './LoopBodyNode.svelte';
  import LoopStartNode from './LoopStartNode.svelte';
  import ConditionBranchNode from './ConditionBranchNode.svelte';
  import IfNode from './IfNode.svelte';
  import DefaultEdge from './DefaultEdge.svelte';
  import CustomConnectionLine from './CustomConnectionLine.svelte';
  import ActionsPalette from './ActionsPalette.svelte';
  import { applyDagreLayout, layoutSubflowChildren, type LayoutDirection } from '../../layout.js';
  import { parseArrayType, type SchemaProperty } from '../../typeEngine.js';
  import type {
    ActionSummary,
    ActionDetail,
    ActionNodeData,
    StartNodeData,
    UtilNodeData,
    UtilType,
    VariablePoolNodeData,
    VariableDefinition,
    AssignNodeData,
    ConditionNodeData,
    LoopNodeData,
    LoopBodyNodeData,
    LoopStartNodeData,
    ConditionBranchNodeData,
    IfNodeData,
    FlowNode,
    FlowEdge,
    WorkflowDefinition,
    JsonSchemaProperty,
    NodeDebugResult,
    DebugStateMap,
  } from '../../types.js';
  import { NODES_CONTEXT_KEY, EDGES_CONTEXT_KEY, EDGE_DELETE_CONTEXT_KEY, DEBUG_STATE_CONTEXT_KEY, RUN_NODE_CONTEXT_KEY, OPEN_DEBUG_DIALOG_CONTEXT_KEY, UTIL_DEFINITIONS } from '../../types.js';
  import type { OpenDebugDialogParams } from '../../types.js';
  import NodeDebugDialog from './NodeDebugDialog.svelte';
  import {
    generateId,
    sortNodesForParentChild,
    collectCascadeDeleteIds,
    getOutputPinType,
    getOutputPinSchema,
    getInputPinType,
    validateConnection,
    validateConnectionWithReason,
    createActionNode,
    createStartNode,
    createUtilNode,
    createVariablePoolNode,
    createAssignNode,
    createConditionNode,
    createLoopNode,
    createConditionBranchNode,
    createLoopBodyWithStart,
    createNewLoopNode,
    createNewIfNode,
    determineDragOperation,
    moveNodeIntoSubflow,
    moveNodeOutOfSubflow,
    moveNodeBetweenSubflows,
    calculateLoopItemType,
    updateLoopNodesType,
  } from '../../utils/index.js';

  // Debug Sheet 状态
  let debugSheetOpen = $state(false);

  // 调试对话框状态
  let debugDialogOpen = $state(false);
  let debugDialogParams = $state<OpenDebugDialogParams>({
    nodeId: '',
    nodeName: '',
    nodeType: '',
    initialInput: {},
  });

  // 右键菜单状态
  let contextMenuOpen = $state(false);
  let contextMenuPosition = $state({ x: 0, y: 0 });

  // 工具节点分类（用于右键菜单）
  const utilCategories = [
    {
      name: '类型转换',
      icon: IconTransform,
      utils: ['toString', 'toNumber', 'toBoolean'] as UtilType[],
    },
    {
      name: '类型检查',
      icon: IconHelpCircle,
      utils: ['isType'] as UtilType[],
    },
    {
      name: '算术运算',
      icon: IconCalculator,
      utils: ['add', 'subtract', 'multiply', 'divide', 'modulo'] as UtilType[],
    },
    {
      name: '比较运算',
      icon: IconCompare,
      utils: ['equal', 'notEqual', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'] as UtilType[],
    },
    {
      name: '逻辑运算',
      icon: IconLogic,
      utils: ['and', 'or', 'not'] as UtilType[],
    },
    {
      name: '字符串',
      icon: IconTextFormatting,
      utils: ['concat', 'substring', 'stringLength', 'toUpperCase', 'toLowerCase', 'trim', 'split', 'replace', 'includes'] as UtilType[],
    },
    {
      name: '数组',
      icon: IconList,
      utils: ['arrayCount', 'arrayGet', 'arrayFirst', 'arrayLast', 'arrayJoin'] as UtilType[],
    },
  ];

  interface Props {
    actions: ActionSummary[];
    getActionDetail: (name: string) => Promise<ActionDetail>;
    initialWorkflow?: WorkflowDefinition;
    onWorkflowChange?: (workflow: WorkflowDefinition) => void;
    /** 开始节点的输入 Schema（JSON Schema 格式） */
    inputSchema?: Record<string, JsonSchemaProperty>;
    /** 连接错误回调（用于显示 toast 提示） */
    onConnectionError?: (reason: string) => void;
    /** 运行单个节点的回调（用于调试或执行） */
    onRunNode?: (nodeName: string, input: Record<string, unknown>) => Promise<unknown>;
    /** 颜色模式：'light' | 'dark' | 'system' */
    colorMode?: 'light' | 'dark';
  }

  let { actions, getActionDetail, initialWorkflow, onWorkflowChange, inputSchema, onConnectionError, onRunNode, colorMode }: Props = $props();

  const nodeTypes: NodeTypes = {
    action: ActionNode,
    start: StartNode,
    util: UtilNode,
    variablePool: VariablePoolNode,
    assign: AssignNode,
    condition: ConditionNode,
    loop: LoopNode,
    loopBody: LoopBodyNode,
    loopStart: LoopStartNode,
    conditionBranch: ConditionBranchNode,
    if: IfNode,
  };

  const edgeTypes: EdgeTypes = {
    default: DefaultEdge,
  };

  type AllNodeData = ActionNodeData | StartNodeData | UtilNodeData | VariablePoolNodeData | AssignNodeData | ConditionNodeData | LoopNodeData | LoopBodyNodeData | LoopStartNodeData | ConditionBranchNodeData | IfNodeData;

  // 初始化节点：如果没有开始节点或变量池节点，自动创建
  function initializeNodes(initialNodes: Node<AllNodeData>[]): Node<AllNodeData>[] {
    const sorted = sortNodesForParentChild(initialNodes);
    const result = [...sorted];
    
    // 检查是否已有开始节点
    if (!result.some((n) => n.type === 'start')) {
      const startNode = createStartNode(undefined, inputSchema);
      result.unshift(startNode);
    }
    
    // 检查是否已有变量池节点
    if (!result.some((n) => n.type === 'variablePool')) {
      const variablePoolNode = createVariablePoolNode(handleVariablesChange, undefined);
      result.push(variablePoolNode);
    }
    
    return result;
  }

  let nodes = $state<Node<AllNodeData>[]>(
    initializeNodes((initialWorkflow?.nodes as Node<AllNodeData>[]) ?? [])
  );
  let edges = $state<Edge[]>(initialWorkflow?.edges ?? []);

  setContext(NODES_CONTEXT_KEY, () => nodes);
  setContext(EDGES_CONTEXT_KEY, () => edges);

  // 调试状态管理
  let debugState = $state<DebugStateMap>(new Map());

  // 设置调试状态 context
  setContext(DEBUG_STATE_CONTEXT_KEY, () => debugState);

  // 运行节点的包装函数
  async function handleRunNode(nodeId: string, nodeName: string, input: Record<string, unknown>) {
    if (!onRunNode) return;
    
    // 设置运行中状态
    const newState = new Map(debugState);
    newState.set(nodeId, { status: 'running', input, timestamp: Date.now() });
    debugState = newState;
    
    try {
      const output = await onRunNode(nodeName, input);
      // 设置成功状态
      const successState = new Map(debugState);
      successState.set(nodeId, { status: 'success', input, output, timestamp: Date.now() });
      debugState = successState;
    } catch (err) {
      // 设置错误状态
      const errorState = new Map(debugState);
      const errorMessage = err instanceof Error ? err.message : String(err);
      errorState.set(nodeId, { status: 'error', input, error: errorMessage, timestamp: Date.now() });
      debugState = errorState;
    }
  }

  // 设置运行节点 context
  setContext(RUN_NODE_CONTEXT_KEY, onRunNode ? handleRunNode : undefined);

  // 打开调试对话框
  function openDebugDialog(params: OpenDebugDialogParams) {
    // 从 debugState 获取已有的输入数据
    const existingResult = debugState.get(params.nodeId);
    debugDialogParams = {
      ...params,
      initialInput: existingResult?.input ?? params.initialInput,
    };
    debugDialogOpen = true;
  }

  // 设置打开调试对话框 context
  setContext(OPEN_DEBUG_DIALOG_CONTEXT_KEY, onRunNode ? openDebugDialog : undefined);

  // 从对话框运行节点
  async function handleRunNodeFromDialog(input: Record<string, unknown>) {
    if (!onRunNode) return;
    const { nodeId, nodeName } = debugDialogParams;
    await handleRunNode(nodeId, nodeName, input);
  }

  // 删除边的函数
  function handleEdgeDelete(edgeId: string) {
    edges = edges.filter((e) => e.id !== edgeId);
    notifyChange();
  }

  setContext(EDGE_DELETE_CONTEXT_KEY, handleEdgeDelete);

  let syncedEdgeIds = new Set<string>();

  // 监听边的变化，自动更新循环节点的输入类型
  $effect(() => {
    const currentEdges = edges;
    for (const edge of currentEdges) {
      if (syncedEdgeIds.has(edge.id)) continue;
      if (edge.targetHandle !== 'input-source') continue;

      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!targetNode || targetNode.type !== 'loop') continue;

      const sourceType = getOutputPinType(nodes, edge.source, edge.sourceHandle ?? '');
      if (!sourceType) continue;

      syncedEdgeIds.add(edge.id);
      const sourceSchema = getOutputPinSchema(nodes, edge.source, edge.sourceHandle ?? '');
      const loopNodeId = targetNode.id;

      setTimeout(() => {
        const loopTypeInfo = calculateLoopItemType(sourceType, sourceSchema);
        nodes = updateLoopNodesType(nodes, loopNodeId, sourceType, loopTypeInfo);
        notifyChange();
      }, 0);
    }

    const currentEdgeIds = new Set(currentEdges.map(e => e.id));
    for (const id of syncedEdgeIds) {
      if (!currentEdgeIds.has(id)) syncedEdgeIds.delete(id);
    }
  });

  // 删除单个节点（开始节点和变量池节点不可删除）
  function handleNodeDelete(nodeId: string) {
    const nodeToDelete = nodes.find((n) => n.id === nodeId);
    // 开始节点和变量池节点不可删除
    if (nodeToDelete?.type === 'start' || nodeToDelete?.type === 'variablePool') {
      return;
    }
    
    const toDelete = new Set<string>();
    collectCascadeDeleteIds(nodeId, nodes, edges, toDelete);
    edges = edges.filter((e) => !toDelete.has(e.source) && !toDelete.has(e.target));
    nodes = nodes.filter((n) => !toDelete.has(n.id));
    notifyChange();
  }

  // 添加 Action 节点
  async function handleAddAction(actionSummary: ActionSummary) {
    const detail = await getActionDetail(actionSummary.name);
    const position = { x: 300 + nodes.length * 50, y: 100 + nodes.length * 30 };
    const newNode = createActionNode(detail, position, handleNodeDelete);
    nodes = [...nodes, newNode];
    notifyChange();
  }

  // 处理 Util 节点配置变更
  function handleUtilConfigChange(nodeId: string, config: UtilNodeData['config']) {
    nodes = nodes.map((n) => {
      if (n.id === nodeId && n.type === 'util') {
        const utilData = n.data as UtilNodeData;
        return { ...n, data: { ...utilData, config, onConfigChange: handleUtilConfigChange, onDelete: handleNodeDelete } };
      }
      return n;
    });
    notifyChange();
  }

  // 添加 Util 节点
  function addUtilNode(utilType: UtilType) {
    const position = { x: 300 + nodes.length * 50, y: 100 + nodes.length * 30 };
    const newNode = createUtilNode(utilType, position, handleUtilConfigChange, handleNodeDelete);
    nodes = [...nodes, newNode];
    notifyChange();
  }

  // 在指定位置添加 Util 节点（用于右键菜单）
  function addUtilNodeAtPosition(utilType: UtilType, position: { x: number; y: number }) {
    const newNode = createUtilNode(utilType, position, handleUtilConfigChange, handleNodeDelete);
    nodes = [...nodes, newNode];
    notifyChange();
  }

  // 处理变量池变量变更
  function handleVariablesChange(nodeId: string, variables: VariableDefinition[]) {
    const oldNode = nodes.find((n) => n.id === nodeId && n.type === 'variablePool');
    const oldVariables = oldNode ? (oldNode.data as VariablePoolNodeData).variables : [];
    const oldKeys = new Set(oldVariables.map((v) => v.key));
    const newKeys = new Set(variables.map((v) => v.key));
    const deletedKeys = [...oldKeys].filter((k) => !newKeys.has(k));

    if (deletedKeys.length > 0) {
      edges = edges.filter((e) => {
        if (e.source === nodeId) {
          const outputKey = e.sourceHandle?.replace('output-', '');
          return outputKey ? !deletedKeys.includes(outputKey) : true;
        }
        return true;
      });
    }

    nodes = nodes.map((n) => {
      if (n.id === nodeId && n.type === 'variablePool') {
        return { ...n, data: { ...n.data, variables, onVariablesChange: handleVariablesChange, onDelete: handleNodeDelete } };
      }
      return n;
    });

    syncAssignNodesVariables(variables);
    notifyChange();
  }

  // 同步赋值节点的可用变量列表
  function syncAssignNodesVariables(variables: VariableDefinition[]) {
    nodes = nodes.map((n) => {
      if (n.type === 'assign') {
        const assignData = n.data as AssignNodeData;
        const targetStillExists = variables.some((v) => v.key === assignData.targetVariableKey);
        return {
          ...n,
          data: {
            ...assignData,
            availableVariables: variables,
            targetVariableKey: targetStillExists ? assignData.targetVariableKey : '',
            onTargetChange: handleAssignTargetChange,
            onDelete: handleNodeDelete,
          },
        };
      }
      return n;
    });
  }

  function getVariablePoolVariables(): VariableDefinition[] {
    const poolNode = nodes.find((n) => n.type === 'variablePool');
    if (!poolNode) return [];
    return (poolNode.data as VariablePoolNodeData).variables;
  }

  function handleAssignTargetChange(nodeId: string, targetKey: string) {
    nodes = nodes.map((n) => {
      if (n.id === nodeId && n.type === 'assign') {
        const assignData = n.data as AssignNodeData;
        return {
          ...n,
          data: { ...assignData, targetVariableKey: targetKey, onTargetChange: handleAssignTargetChange, onDelete: handleNodeDelete },
        };
      }
      return n;
    });
    notifyChange();
  }

  function addAssignNode() {
    const variables = getVariablePoolVariables();
    const position = { x: 300 + nodes.length * 50, y: 100 + nodes.length * 30 };
    const newNode = createAssignNode(position, variables, handleAssignTargetChange, handleNodeDelete);
    nodes = [...nodes, newNode];
    notifyChange();
  }

  // 在指定位置添加赋值节点（用于右键菜单）
  function addAssignNodeAtPosition(position: { x: number; y: number }) {
    const variables = getVariablePoolVariables();
    const newNode = createAssignNode(position, variables, handleAssignTargetChange, handleNodeDelete);
    nodes = [...nodes, newNode];
    notifyChange();
  }

  function addConditionNode() {
    const position = { x: 300 + nodes.length * 50, y: 100 + nodes.length * 30 };
    const result = createConditionNode(position, handleNodeDelete);
    nodes = [...nodes, result.conditionNode, result.trueBranchNode, result.falseBranchNode];
    edges = [...edges, ...result.edges];
    notifyChange();
  }

  function addLoopNode() {
    const position = { x: 300 + nodes.length * 50, y: 100 + nodes.length * 30 };
    const result = createLoopNode(position, handleNodeDelete);
    nodes = [...nodes, result.loopNode, result.loopBodyNode, result.loopStartNode];
    edges = [...edges, result.edge];
    notifyChange();
  }

  // 新版循环节点（内嵌 SubFlow）
  function addNewLoopNode() {
    const position = { x: 300 + nodes.length * 50, y: 100 + nodes.length * 30 };
    const result = createNewLoopNode(position, handleNodeDelete);
    // 添加 onSizeChange 回调
    const loopNode = {
      ...result.loopNode,
      data: {
        ...result.loopNode.data,
        onSizeChange: handleLoopSizeChange,
      },
    };
    nodes = [...nodes, loopNode];
    notifyChange();
  }

  // 在指定位置添加循环节点（用于右键菜单）
  function addNewLoopNodeAtPosition(position: { x: number; y: number }) {
    const result = createNewLoopNode(position, handleNodeDelete);
    const loopNode = {
      ...result.loopNode,
      data: {
        ...result.loopNode.data,
        onSizeChange: handleLoopSizeChange,
      },
    };
    nodes = [...nodes, loopNode];
    notifyChange();
  }

  // If 节点 else 开关处理
  function handleElseToggle(nodeId: string, hasElse: boolean) {
    nodes = nodes.map((n) => {
      if (n.id === nodeId && n.type === 'if') {
        const ifData = n.data as IfNodeData;
        return {
          ...n,
          data: {
            ...ifData,
            hasElse,
            onElseToggle: handleElseToggle,
            onDelete: handleNodeDelete,
            onSizeChange: handleIfSizeChange,
          },
        };
      }
      return n;
    });
    notifyChange();
  }

  // If 节点尺寸变更处理
  function handleIfSizeChange(nodeId: string, ifSize: { width: number; height: number }, elseSize?: { width: number; height: number }) {
    nodes = nodes.map((n) => {
      if (n.id === nodeId && n.type === 'if') {
        const ifData = n.data as IfNodeData;
        return {
          ...n,
          data: {
            ...ifData,
            ifSubflowSize: ifSize,
            elseSubflowSize: elseSize ?? ifData.elseSubflowSize,
            onElseToggle: handleElseToggle,
            onDelete: handleNodeDelete,
            onSizeChange: handleIfSizeChange,
          },
        };
      }
      return n;
    });
    notifyChange();
  }

  // Loop 节点尺寸变更处理
  function handleLoopSizeChange(nodeId: string, size: { width: number; height: number }) {
    nodes = nodes.map((n) => {
      if (n.id === nodeId && n.type === 'loop') {
        const loopData = n.data as LoopNodeData;
        return {
          ...n,
          data: {
            ...loopData,
            subflowSize: size,
            onDelete: handleNodeDelete,
            onSizeChange: handleLoopSizeChange,
          },
        };
      }
      return n;
    });
    notifyChange();
  }

  // 新版条件节点（内嵌 if/else SubFlow）
  function addNewIfNode() {
    const position = { x: 300 + nodes.length * 50, y: 100 + nodes.length * 30 };
    const result = createNewIfNode(position, handleNodeDelete, handleElseToggle);
    // 添加 onSizeChange 回调
    const ifNode = {
      ...result.ifNode,
      data: {
        ...result.ifNode.data,
        onSizeChange: handleIfSizeChange,
      },
    };
    nodes = [...nodes, ifNode];
    notifyChange();
  }

  // 在指定位置添加条件节点（用于右键菜单）
  function addNewIfNodeAtPosition(position: { x: number; y: number }) {
    const result = createNewIfNode(position, handleNodeDelete, handleElseToggle);
    const ifNode = {
      ...result.ifNode,
      data: {
        ...result.ifNode.data,
        onSizeChange: handleIfSizeChange,
      },
    };
    nodes = [...nodes, ifNode];
    notifyChange();
  }

  // 右键菜单处理 - 记录点击位置用于创建节点
  function handlePaneContextMenu(event: MouseEvent | { event: MouseEvent }) {
    // SvelteFlow 的 onpanecontextmenu 事件格式
    const mouseEvent = 'event' in event ? event.event : event;
    // 获取 flow 容器的位置
    const container = (mouseEvent.target as HTMLElement)?.closest('.svelte-flow');
    if (container) {
      const rect = container.getBoundingClientRect();
      // 简单的坐标转换（不考虑缩放和平移，后续可以优化）
      contextMenuPosition = { 
        x: mouseEvent.clientX - rect.left, 
        y: mouseEvent.clientY - rect.top 
      };
    }
  }

  function handleContextMenuSelect(action: string, utilType?: UtilType) {
    contextMenuOpen = false;
    const position = contextMenuPosition;
    
    switch (action) {
      case 'assign':
        addAssignNodeAtPosition(position);
        break;
      case 'if':
        addNewIfNodeAtPosition(position);
        break;
      case 'loop':
        addNewLoopNodeAtPosition(position);
        break;
      case 'layout-horizontal':
        handleApplyLayout('LR');
        break;
      case 'layout-vertical':
        handleApplyLayout('TB');
        break;
      case 'debug':
        debugSheetOpen = true;
        break;
      case 'util':
        if (utilType) {
          addUtilNodeAtPosition(utilType, position);
        }
        break;
    }
  }

  // 连接验证（SvelteFlow 调用此函数来决定是否允许连接）
  function isValidConnection(connection: Edge | Connection): boolean {
    return validateAndRecordError(connection);
  }

  // 记录最后一次连接验证失败的原因
  let lastConnectionError: string | null = $state(null);
  // 标记连接是否成功（用于避免成功后显示错误 toast）
  let connectionSucceeded = $state(false);

  // 连接验证并记录错误原因（只在有明确目标时记录）
  function validateAndRecordError(connection: Edge | Connection): boolean {
    const result = validateConnectionWithReason(connection, nodes, edges);
    // 只有当有明确的目标节点和目标引脚时才记录错误
    if (connection.target && connection.targetHandle) {
      if (!result.valid && result.reason) {
        lastConnectionError = result.reason;
      } else {
        lastConnectionError = null;
      }
    }
    return result.valid;
  }

  let connectingSource: { nodeId: string; handleId: string } | null = $state(null);

  function handleConnectStart(_: MouseEvent | TouchEvent, params: { nodeId: string | null; handleId: string | null; handleType: 'source' | 'target' | null }) {
    if (params.nodeId && params.handleId && params.handleType === 'source') {
      connectingSource = { nodeId: params.nodeId, handleId: params.handleId };
      connectionSucceeded = false;
      lastConnectionError = null;
    }
  }

  function handleConnectEndWithAutoCreate(event: MouseEvent | TouchEvent) {
    const savedConnectingSource = connectingSource;
    
    // 只有在连接失败时才通知错误
    if (lastConnectionError && !connectionSucceeded) {
      onConnectionError?.(lastConnectionError);
    }
    
    // 重置状态
    lastConnectionError = null;
    connectionSucceeded = false;
    
    if (!savedConnectingSource) {
      connectingSource = null;
      return;
    }

    const { nodeId: sourceNodeId, handleId: sourceHandleId } = savedConnectingSource;
    connectingSource = null;

    const sourceNode = nodes.find((n) => n.id === sourceNodeId);
    if (!sourceNode) return;

    let clientX: number, clientY: number;
    if ('touches' in event) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const flowContainer = (event.target as HTMLElement)?.closest('.svelte-flow');
    if (!flowContainer) return;

    const rect = flowContainer.getBoundingClientRect();
    const position = { x: clientX - rect.left, y: clientY - rect.top };

    // 处理条件节点的 true/false 输出
    if (sourceNode.type === 'condition') {
      if (sourceHandleId !== 'output-true' && sourceHandleId !== 'output-false') return;

      const conditionData = sourceNode.data as ConditionNodeData;
      const branchType = sourceHandleId === 'output-true' ? 'true' : 'false';
      const existingBranchId = branchType === 'true' ? conditionData.trueBranchId : conditionData.falseBranchId;

      if (existingBranchId && nodes.find((n) => n.id === existingBranchId)) return;
      if (edges.find((e) => e.source === sourceNodeId && e.sourceHandle === sourceHandleId)) return;

      const { node: branchNode, edge: branchEdge } = createConditionBranchNode(position, branchType, sourceNodeId, handleNodeDelete);
      nodes = [...nodes, branchNode];
      edges = [...edges, branchEdge];

      nodes = nodes.map((n) => {
        if (n.id === sourceNodeId && n.type === 'condition') {
          const data = n.data as ConditionNodeData;
          return { ...n, data: { ...data, [branchType === 'true' ? 'trueBranchId' : 'falseBranchId']: branchNode.id } };
        }
        return n;
      });

      notifyChange();
      return;
    }

    // 处理循环节点的 body 输出
    if (sourceNode.type === 'loop') {
      if (sourceHandleId !== 'output-body') return;

      const loopData = sourceNode.data as LoopNodeData;
      let itemType = 'object';
      if (loopData.inputType === 'number') {
        itemType = 'number';
      } else {
        const inner = parseArrayType(loopData.inputType);
        if (inner) itemType = inner;
      }

      const { loopBodyNode, loopStartNode, edge } = createLoopBodyWithStart(position, sourceNodeId, itemType, handleNodeDelete);
      nodes = [...nodes, loopBodyNode, loopStartNode];
      edges = [...edges, edge];

      if (!loopData.loopBodyId) {
        nodes = nodes.map((n) => {
          if (n.id === sourceNodeId && n.type === 'loop') {
            const data = n.data as LoopNodeData;
            return { ...n, data: { ...data, loopBodyId: loopBodyNode.id } };
          }
          return n;
        });
      }

      notifyChange();
      return;
    }
  }

  function handleConnect(connection: Connection) {
    // 标记连接成功
    connectionSucceeded = true;
    lastConnectionError = null;

    const newEdge: Edge = {
      id: `edge_${connection.source}_${connection.sourceHandle}_${connection.target}_${connection.targetHandle}`,
      source: connection.source ?? '',
      sourceHandle: connection.sourceHandle,
      target: connection.target ?? '',
      targetHandle: connection.targetHandle,
      type: 'default',
    };

    edges = [...edges, newEdge];
    connectingSource = null;

    const targetNode = nodes.find((n) => n.id === connection.target);
    if (targetNode && (targetNode.type === 'action' || targetNode.type === 'util' || targetNode.type === 'assign' || targetNode.type === 'condition' || targetNode.type === 'loop')) {
      const inputKey = connection.targetHandle?.replace('input-', '') ?? '';
      const outputKey = connection.sourceHandle?.replace('output-', '') ?? '';

      const sourceType = getOutputPinType(nodes, connection.source ?? '', connection.sourceHandle ?? '');

      if (targetNode.type === 'loop' && inputKey === 'source' && sourceType) {
        const sourceSchema = getOutputPinSchema(nodes, connection.source ?? '', connection.sourceHandle ?? '');
        const loopTypeInfo = calculateLoopItemType(sourceType, sourceSchema);
        nodes = updateLoopNodesType(nodes, targetNode.id, sourceType, loopTypeInfo);
      }

      type NodeWithMappings = ActionNodeData | UtilNodeData | AssignNodeData | ConditionNodeData | LoopNodeData;
      const nodeData = targetNode.data as NodeWithMappings;
      const updatedData = { ...nodeData, inputMappings: { ...nodeData.inputMappings, [inputKey]: { nodeId: connection.source ?? '', outputKey } } };
      nodes = nodes.map((n) => n.id === connection.target ? { ...n, data: updatedData } : n);
    }

    notifyChange();
  }

  function handleDelete({ nodes: deletedNodes, edges: deletedEdges }: { nodes: Node[]; edges: Edge[] }) {
    for (const edge of deletedEdges) {
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (targetNode && (targetNode.type === 'action' || targetNode.type === 'util' || targetNode.type === 'assign')) {
        const inputKey = edge.targetHandle?.replace('input-', '') ?? '';
        const nodeData = targetNode.data as ActionNodeData | UtilNodeData | AssignNodeData;
        const { [inputKey]: _, ...restMappings } = nodeData.inputMappings;
        nodes = nodes.map((n) => n.id === edge.target ? { ...n, data: { ...nodeData, inputMappings: restMappings } } : n);
      }
    }

    if (deletedNodes.length > 0) {
      const deletedIds = new Set(deletedNodes.map((n) => n.id));
      edges = edges.filter((e) => !deletedIds.has(e.source) && !deletedIds.has(e.target));
      nodes = nodes.filter((n) => !deletedIds.has(n.id));
    }

    if (deletedEdges.length > 0) {
      const deletedEdgeIds = new Set(deletedEdges.map((e) => e.id));
      edges = edges.filter((e) => !deletedEdgeIds.has(e.id));
    }

    notifyChange();
  }

  function handleNodeDragStop({ targetNode }: { event: MouseEvent | TouchEvent; targetNode: Node | null; nodes: Node[] }) {
    if (!targetNode) return;

    const operation = determineDragOperation(targetNode, nodes);

    switch (operation.type) {
      case 'into-subflow':
        nodes = moveNodeIntoSubflow(nodes, targetNode.id, operation.targetSubflowId, operation.absolutePosition, operation.targetSubflowType);
        notifyChange();
        break;
      case 'out-of-subflow':
        nodes = moveNodeOutOfSubflow(nodes, targetNode.id, operation.currentParentId, operation.absolutePosition, operation.currentSubflowType);
        notifyChange();
        break;
      case 'between-subflows':
        nodes = moveNodeBetweenSubflows(nodes, targetNode.id, operation.currentParentId, operation.targetSubflowId, operation.absolutePosition, operation.currentSubflowType, operation.targetSubflowType);
        notifyChange();
        break;
    }
  }

  function notifyChange() {
    if (onWorkflowChange) {
      onWorkflowChange({
        id: initialWorkflow?.id ?? generateId(),
        name: initialWorkflow?.name ?? 'Untitled Workflow',
        nodes: nodes as unknown as FlowNode[],
        edges: edges as FlowEdge[],
      });
    }
  }

  function handleApplyLayout(direction: LayoutDirection) {
    if (nodes.length === 0) return;

    // 收集所有 SubFlow 容器节点（旧版和新版）
    const legacySubflowNodes = nodes.filter(n => n.type === 'loopBody' || n.type === 'conditionBranch');
    const newLoopNodes = nodes.filter(n => n.type === 'loop');
    const newIfNodes = nodes.filter(n => n.type === 'if');
    
    const subflowUpdates = new Map<string, { childPositions: Map<string, { x: number; y: number }>; size: { width: number; height: number } }>();
    
    // 新版 loop 节点的 SubFlow 更新
    const loopSubflowUpdates = new Map<string, { childPositions: Map<string, { x: number; y: number }>; size: { width: number; height: number } }>();
    
    // 新版 if 节点的 SubFlow 更新（分 if 和 else）
    const ifSubflowUpdates = new Map<string, { 
      ifChildPositions: Map<string, { x: number; y: number }>; 
      ifSize: { width: number; height: number };
      elseChildPositions: Map<string, { x: number; y: number }>; 
      elseSize: { width: number; height: number };
    }>();

    // 处理旧版 SubFlow 节点
    for (const subflow of legacySubflowNodes) {
      const childNodes = nodes.filter(n => n.parentId === subflow.id);
      if (childNodes.length === 0) continue;

      const { childNodes: layoutedChildren, requiredSize } = layoutSubflowChildren(childNodes, edges, { rankdir: direction });
      const childPositions = new Map<string, { x: number; y: number }>();
      for (const child of layoutedChildren) {
        childPositions.set(child.id, child.position);
      }
      subflowUpdates.set(subflow.id, { childPositions, size: requiredSize });
    }

    // 处理新版 loop 节点
    for (const loopNode of newLoopNodes) {
      const loopData = loopNode.data as LoopNodeData;
      const childNodes = nodes.filter(n => loopData.childNodeIds.includes(n.id));
      if (childNodes.length === 0) continue;

      const { childNodes: layoutedChildren, requiredSize } = layoutSubflowChildren(childNodes, edges, { rankdir: direction });
      const childPositions = new Map<string, { x: number; y: number }>();
      for (const child of layoutedChildren) {
        childPositions.set(child.id, child.position);
      }
      loopSubflowUpdates.set(loopNode.id, { childPositions, size: requiredSize });
    }

    // 处理新版 if 节点
    for (const ifNode of newIfNodes) {
      const ifData = ifNode.data as IfNodeData;
      
      // if 分支
      const ifChildNodes = nodes.filter(n => ifData.ifChildNodeIds.includes(n.id));
      let ifChildPositions = new Map<string, { x: number; y: number }>();
      let ifSize = { width: 280, height: 120 };
      if (ifChildNodes.length > 0) {
        const { childNodes: layoutedIfChildren, requiredSize } = layoutSubflowChildren(ifChildNodes, edges, { rankdir: direction });
        for (const child of layoutedIfChildren) {
          ifChildPositions.set(child.id, child.position);
        }
        ifSize = requiredSize;
      }
      
      // else 分支
      const elseChildNodes = nodes.filter(n => ifData.elseChildNodeIds.includes(n.id));
      let elseChildPositions = new Map<string, { x: number; y: number }>();
      let elseSize = { width: 280, height: 120 };
      if (elseChildNodes.length > 0) {
        const { childNodes: layoutedElseChildren, requiredSize } = layoutSubflowChildren(elseChildNodes, edges, { rankdir: direction });
        for (const child of layoutedElseChildren) {
          elseChildPositions.set(child.id, child.position);
        }
        elseSize = requiredSize;
      }
      
      ifSubflowUpdates.set(ifNode.id, { ifChildPositions, ifSize, elseChildPositions, elseSize });
    }

    const mainFlowNodes = nodes.filter(n => !n.parentId);
    const layoutedMainNodes = applyDagreLayout(mainFlowNodes, edges, { rankdir: direction });
    const mainNodePositions = new Map<string, { x: number; y: number }>();
    for (const node of layoutedMainNodes) {
      mainNodePositions.set(node.id, node.position);
    }

    nodes = nodes.map(n => {
      // 主流程节点
      if (!n.parentId && mainNodePositions.has(n.id)) {
        const newPos = mainNodePositions.get(n.id)!;
        
        // 旧版 SubFlow 容器节点
        if (subflowUpdates.has(n.id)) {
          const { size } = subflowUpdates.get(n.id)!;
          return { ...n, position: newPos, style: `width: ${size.width}px; height: ${size.height}px;` };
        }
        
        // 新版 loop 节点
        if (n.type === 'loop' && loopSubflowUpdates.has(n.id)) {
          const { size } = loopSubflowUpdates.get(n.id)!;
          const loopData = n.data as LoopNodeData;
          return { 
            ...n, 
            position: newPos, 
            data: { ...loopData, subflowSize: size, onDelete: handleNodeDelete, onSizeChange: handleLoopSizeChange } 
          };
        }
        
        // 新版 if 节点
        if (n.type === 'if' && ifSubflowUpdates.has(n.id)) {
          const { ifSize, elseSize } = ifSubflowUpdates.get(n.id)!;
          const ifData = n.data as IfNodeData;
          return { 
            ...n, 
            position: newPos, 
            data: { 
              ...ifData, 
              ifSubflowSize: ifSize, 
              elseSubflowSize: elseSize,
              onDelete: handleNodeDelete, 
              onElseToggle: handleElseToggle,
              onSizeChange: handleIfSizeChange,
            } 
          };
        }
        
        return { ...n, position: newPos };
      }
      
      // 旧版 SubFlow 子节点（通过 parentId 关联）
      if (n.parentId && subflowUpdates.has(n.parentId)) {
        const { childPositions } = subflowUpdates.get(n.parentId)!;
        if (childPositions.has(n.id)) {
          return { ...n, position: childPositions.get(n.id)! };
        }
      }
      
      // 新版 loop 节点的子节点
      for (const [loopId, update] of loopSubflowUpdates) {
        if (update.childPositions.has(n.id)) {
          return { ...n, position: update.childPositions.get(n.id)!, parentId: loopId, extent: 'parent' as const };
        }
      }
      
      // 新版 if 节点的子节点
      for (const [ifId, update] of ifSubflowUpdates) {
        if (update.ifChildPositions.has(n.id)) {
          return { ...n, position: update.ifChildPositions.get(n.id)!, parentId: ifId, extent: 'parent' as const };
        }
        if (update.elseChildPositions.has(n.id)) {
          return { ...n, position: update.elseChildPositions.get(n.id)!, parentId: ifId, extent: 'parent' as const };
        }
      }
      
      return n;
    });

    notifyChange();
  }

  export function getWorkflow(): WorkflowDefinition {
    return {
      id: initialWorkflow?.id ?? generateId(),
      name: initialWorkflow?.name ?? 'Untitled Workflow',
      nodes: nodes as unknown as FlowNode[],
      edges: edges as FlowEdge[],
    };
  }
</script>

<Tooltip.Provider>
<ContextMenu.Root bind:open={contextMenuOpen}>
<div class="flex w-full h-full bg-muted">
  <ActionsPalette {actions} onAddAction={handleAddAction} />
  
  <ContextMenu.Trigger class="flex-1 flex flex-col relative" oncontextmenu={handlePaneContextMenu}>
    <SvelteFlow style="background-color: var(--background)" bind:nodes bind:edges {nodeTypes} {edgeTypes} connectionLineComponent={CustomConnectionLine} {isValidConnection} {colorMode} onconnect={handleConnect} onconnectstart={handleConnectStart} onconnectend={handleConnectEndWithAutoCreate} ondelete={handleDelete} onnodedragstop={handleNodeDragStop} proOptions={{ hideAttribution: true }} class="actions-flow">
    </SvelteFlow>
  </ContextMenu.Trigger>
  
  <ContextMenu.Content class="w-56">
    <!-- 工具节点子菜单 -->
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>
        <IconTools class="mr-2 size-4" />
        工具节点
      </ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-56">
        {#each utilCategories as category}
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>
              {#if category.icon}
                {@const Icon = category.icon}
                <Icon class="mr-2 size-4" />
              {/if}
              {category.name}
            </ContextMenu.SubTrigger>
            <ContextMenu.SubContent class="w-48">
              {#each category.utils as utilType}
                <ContextMenu.Item onclick={() => handleContextMenuSelect('util', utilType)}>
                  {UTIL_DEFINITIONS[utilType].displayName}
                </ContextMenu.Item>
              {/each}
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        {/each}
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    
    <!-- 流程控制子菜单 -->
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>
        <IconBranch class="mr-2 size-4" />
        流程控制
      </ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-40">
        <ContextMenu.Item onclick={() => handleContextMenuSelect('if')}>
          <IconCondition class="mr-2 size-4" />
          条件节点
        </ContextMenu.Item>
        <ContextMenu.Item onclick={() => handleContextMenuSelect('loop')}>
          <IconLoop class="mr-2 size-4" />
          循环节点
        </ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    
    <!-- 赋值节点 -->
    <ContextMenu.Item onclick={() => handleContextMenuSelect('assign')}>
      <IconAssign class="mr-2 size-4" />
      赋值节点
    </ContextMenu.Item>
    
    <ContextMenu.Separator />
    
    <!-- 布局子菜单 -->
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>
        <IconLayout class="mr-2 size-4" />
        自动布局
      </ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-40">
        <ContextMenu.Item onclick={() => handleContextMenuSelect('layout-horizontal')}>
          <IconArrowRight class="mr-2 size-4" />
          水平布局
        </ContextMenu.Item>
        <ContextMenu.Item onclick={() => handleContextMenuSelect('layout-vertical')}>
          <IconArrowDown class="mr-2 size-4" />
          垂直布局
        </ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    
    <ContextMenu.Separator />
    
    <!-- Debug -->
    <ContextMenu.Item onclick={() => handleContextMenuSelect('debug')}>
      <IconBug class="mr-2 size-4" />
      Debug JSON
    </ContextMenu.Item>
  </ContextMenu.Content>
</div>
</ContextMenu.Root>
</Tooltip.Provider>

{#if debugSheetOpen}
  <div class="fixed inset-0 z-50 flex">
    <button class="absolute inset-0 bg-black/50" onclick={() => debugSheetOpen = false} aria-label="Close"></button>
    <div class="absolute right-0 top-0 h-full w-[600px] bg-card shadow-xl flex flex-col">
      <div class="flex items-center justify-between p-4 border-b">
        <div>
          <h2 class="text-lg font-semibold">Debug: Nodes & Edges</h2>
          <p class="text-sm text-muted-foreground">查看当前工作流的节点和边数据</p>
        </div>
        <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-accent" onclick={() => debugSheetOpen = false}>✕</button>
      </div>
      <div class="flex-1 overflow-auto p-4">
        <pre class="text-xs bg-accent p-4 rounded-lg whitespace-pre-wrap break-all">{JSON.stringify({ nodes, edges }, null, 2)}</pre>
      </div>
    </div>
  </div>
{/if}

<!-- 节点调试对话框 -->
<NodeDebugDialog
  bind:open={debugDialogOpen}
  nodeId={debugDialogParams.nodeId}
  nodeName={debugDialogParams.nodeName}
  nodeType={debugDialogParams.nodeType}
  initialInput={debugDialogParams.initialInput}
  inputSchema={debugDialogParams.inputSchema}
  debugResult={debugState.get(debugDialogParams.nodeId)}
  onClose={() => debugDialogOpen = false}
  onRun={handleRunNodeFromDialog}
/>

<style>
  :global(.actions-flow) { flex: 1; }
  :global(.actions-flow .svelte-flow__node) { cursor: grab; }
  :global(.actions-flow .svelte-flow__node:active) { cursor: grabbing; }
</style>
