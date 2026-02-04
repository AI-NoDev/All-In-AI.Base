import type { Node, Edge } from '@xyflow/svelte';
import { graphlib } from 'dagre-d3-es';
import { layout } from 'dagre-d3-es/src/dagre/index.js';

/** 布局方向: TB=从上到下, BT=从下到上, LR=从左到右, RL=从右到左 */
export type LayoutDirection = 'TB' | 'BT' | 'LR' | 'RL';

/** 节点对齐方式: UL=上左, UR=上右, DL=下左, DR=下右 */
export type LayoutAlign = 'UL' | 'UR' | 'DL' | 'DR';

/** 排序算法: network-simplex, tight-tree, longest-path */
export type LayoutRanker = 'network-simplex' | 'tight-tree' | 'longest-path';

/** 布局模式 */
export type LayoutMode = 
  | 'dagre-tb'      // 层次布局 - 从上到下
  | 'dagre-bt'      // 层次布局 - 从下到上
  | 'dagre-lr'      // 层次布局 - 从左到右
  | 'dagre-rl';     // 层次布局 - 从右到左

/** Dagre 图配置 (参考: https://github.com/dagrejs/dagre/wiki#configuring-the-layout) */
export interface DagreGraphConfig {
  /** 布局方向: TB, BT, LR, RL */
  rankdir?: LayoutDirection;
  /** 节点对齐方式: UL, UR, DL, DR */
  align?: LayoutAlign;
  /** 节点水平间距 (像素) */
  nodesep?: number;
  /** 边水平间距 (像素) */
  edgesep?: number;
  /** 层级间距 (像素) */
  ranksep?: number;
  /** 左右边距 (像素) */
  marginx?: number;
  /** 上下边距 (像素) */
  marginy?: number;
  /** 反馈弧集算法: 'greedy' 或 undefined */
  acyclicer?: 'greedy';
  /** 排序算法: network-simplex, tight-tree, longest-path */
  ranker?: LayoutRanker;
}

/** 布局配置 */
export interface LayoutConfig extends DagreGraphConfig {
  /** 节点默认宽度 */
  nodeWidth?: number;
  /** 节点默认高度 */
  nodeHeight?: number;
}

/** 布局模式信息 */
export interface LayoutModeInfo {
  id: LayoutMode;
  name: string;
  description: string;
  direction: LayoutDirection;
}

/** 可用的布局模式列表 */
export const LAYOUT_MODES: LayoutModeInfo[] = [
  {
    id: 'dagre-tb',
    name: '从上到下',
    description: '层次布局，节点从上往下排列',
    direction: 'TB',
  },
  {
    id: 'dagre-bt',
    name: '从下到上',
    description: '层次布局，节点从下往上排列',
    direction: 'BT',
  },
  {
    id: 'dagre-lr',
    name: '从左到右',
    description: '层次布局，节点从左往右排列',
    direction: 'LR',
  },
  {
    id: 'dagre-rl',
    name: '从右到左',
    description: '层次布局，节点从右往左排列',
    direction: 'RL',
  },
];

/** 默认布局配置 */
export const DEFAULT_LAYOUT_CONFIG: Required<LayoutConfig> = {
  rankdir: 'TB',
  align: 'UL',
  nodesep: 50,
  edgesep: 10,
  ranksep: 50,
  marginx: 20,
  marginy: 20,
  acyclicer: 'greedy',
  ranker: 'network-simplex',
  nodeWidth: 220,
  nodeHeight: 80,
};

/** SubFlow 布局配置 */
export const SUBFLOW_LAYOUT_CONFIG: LayoutConfig = {
  rankdir: 'TB',
  nodesep: 30,
  edgesep: 10,
  ranksep: 40,
  marginx: 20,
  marginy: 50, // 留出头部空间
  nodeWidth: 200,
  nodeHeight: 60,
};

/** SubFlow 最小尺寸 */
export const SUBFLOW_MIN_SIZE = {
  width: 300,
  height: 200,
};

/** SubFlow 内边距 */
export const SUBFLOW_PADDING = {
  top: 40,    // 头部高度
  right: 20,
  bottom: 20,
  left: 20,
};

/**
 * 使用 Dagre 对节点进行自动布局
 * @param nodes 节点列表
 * @param edges 边列表
 * @param config 布局配置
 * @returns 更新位置后的节点列表
 */
export function applyDagreLayout<T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  config: LayoutConfig = {}
): Node<T>[] {
  if (nodes.length === 0) return nodes;

  const {
    rankdir,
    align,
    nodesep,
    edgesep,
    ranksep,
    marginx,
    marginy,
    acyclicer,
    ranker,
    nodeWidth,
    nodeHeight,
  } = { ...DEFAULT_LAYOUT_CONFIG, ...config };

  // 创建 dagre 图
  const g = new graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  
  // 设置图的布局选项
  g.setGraph({
    rankdir,
    align,
    nodesep,
    edgesep,
    ranksep,
    marginx,
    marginy,
    acyclicer,
    ranker,
  });

  // 添加节点 (使用实际测量的尺寸或默认值)
  for (const node of nodes) {
    const width = node.measured?.width ?? nodeWidth;
    const height = node.measured?.height ?? nodeHeight;
    g.setNode(node.id, { width, height });
  }

  // 添加边
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  // 执行布局
  layout(g, {});

  // 应用布局结果 (dagre 返回的是节点中心坐标，需要转换为左上角坐标)
  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    if (!nodeWithPosition) return node;

    const width = node.measured?.width ?? nodeWidth;
    const height = node.measured?.height ?? nodeHeight;

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    };
  });
}

/**
 * 根据布局模式应用布局
 * @param nodes 节点列表
 * @param edges 边列表
 * @param mode 布局模式
 * @param config 额外配置
 * @returns 更新位置后的节点列表
 */
export function applyLayout<T extends Record<string, unknown>>(
  nodes: Node<T>[],
  edges: Edge[],
  mode: LayoutMode,
  config?: Omit<LayoutConfig, 'rankdir'>
): Node<T>[] {
  const modeInfo = LAYOUT_MODES.find((m) => m.id === mode);
  if (!modeInfo) return nodes;

  return applyDagreLayout(nodes, edges, {
    ...config,
    rankdir: modeInfo.direction,
  });
}

/** SubFlow 布局结果 */
export interface SubflowLayoutResult<T extends Record<string, unknown>> {
  /** 布局后的子节点 */
  childNodes: Node<T>[];
  /** 计算出的 SubFlow 所需尺寸 */
  requiredSize: { width: number; height: number };
}

/**
 * 对 SubFlow 内部的节点进行布局，并计算所需的容器尺寸
 * @param childNodes SubFlow 内的子节点
 * @param edges 所有边（会自动过滤出子节点之间的边）
 * @param config 布局配置
 * @returns 布局后的子节点和所需尺寸
 */
export function layoutSubflowChildren<T extends Record<string, unknown>>(
  childNodes: Node<T>[],
  edges: Edge[],
  config: LayoutConfig = SUBFLOW_LAYOUT_CONFIG
): SubflowLayoutResult<T> {
  if (childNodes.length === 0) {
    return {
      childNodes: [],
      requiredSize: { width: SUBFLOW_MIN_SIZE.width, height: SUBFLOW_MIN_SIZE.height },
    };
  }

  const childIds = new Set(childNodes.map(n => n.id));
  
  // 过滤出子节点之间的边
  const childEdges = edges.filter(e => childIds.has(e.source) && childIds.has(e.target));

  // 应用布局
  const layoutedNodes = applyDagreLayout(childNodes, childEdges, {
    ...SUBFLOW_LAYOUT_CONFIG,
    ...config,
    // SubFlow 内部使用较小的边距，头部空间由 marginy 提供
    marginx: SUBFLOW_PADDING.left,
    marginy: SUBFLOW_PADDING.top,
  });

  // 计算布局后所需的尺寸
  let maxX = 0;
  let maxY = 0;

  for (const node of layoutedNodes) {
    const nodeWidth = node.measured?.width ?? config.nodeWidth ?? SUBFLOW_LAYOUT_CONFIG.nodeWidth ?? 200;
    const nodeHeight = node.measured?.height ?? config.nodeHeight ?? SUBFLOW_LAYOUT_CONFIG.nodeHeight ?? 60;
    
    const rightEdge = node.position.x + nodeWidth;
    const bottomEdge = node.position.y + nodeHeight;
    
    if (rightEdge > maxX) maxX = rightEdge;
    if (bottomEdge > maxY) maxY = bottomEdge;
  }

  // 添加右侧和底部内边距
  const requiredWidth = Math.max(maxX + SUBFLOW_PADDING.right, SUBFLOW_MIN_SIZE.width);
  const requiredHeight = Math.max(maxY + SUBFLOW_PADDING.bottom, SUBFLOW_MIN_SIZE.height);

  return {
    childNodes: layoutedNodes,
    requiredSize: { width: requiredWidth, height: requiredHeight },
  };
}
