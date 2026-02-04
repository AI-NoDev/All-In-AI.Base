<script lang="ts">
  import { useConnection, type Node } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import { NODES_CONTEXT_KEY, type NodesGetter } from '../../types';
  import { getHandleColor } from '../../edgeTypeRule';
  import { getOutputPinType } from '../../utils/pinTypeUtils';

  // 使用 useConnection hook 获取连接状态
  const connection = useConnection();

  // 从 context 获取 nodes
  const getNodes = getContext<NodesGetter | undefined>(NODES_CONTEXT_KEY);

  // 响应式获取 nodes
  let nodes = $derived(getNodes?.() ?? []);

  // 从连接状态获取源节点和 handle 信息
  let fromNodeId = $derived(connection.current.fromHandle?.nodeId ?? '');
  let fromHandleId = $derived(connection.current.fromHandle?.id ?? '');

  // 计算源引脚类型和颜色
  let sourceType = $derived(
    fromNodeId && fromHandleId
      ? getOutputPinType(nodes as Node[], fromNodeId, fromHandleId)
      : null
  );
  let lineColor = $derived(getHandleColor(sourceType));

  // 获取连接线的坐标
  let fromX = $derived(connection.current.from?.x || 0);
  let fromY = $derived(connection.current.from?.y || 0);
  let toX = $derived(connection.current.to?.x || 0);
  let toY = $derived(connection.current.to?.y || 0);

  // 计算贝塞尔曲线控制点
  let controlPointX1 = $derived(fromX + (toX - fromX) * 0.5);
  let controlPointY1 = $derived(fromY);
  let controlPointX2 = $derived(fromX + (toX - fromX) * 0.5);
  let controlPointY2 = $derived(toY);

  let path = $derived(
    `M ${fromX} ${fromY} C ${controlPointX1} ${controlPointY1}, ${controlPointX2} ${controlPointY2}, ${toX} ${toY}`
  );
</script>

<path
  d={path}
  fill="none"
  stroke={lineColor}
  stroke-width="2"
  class="animated"
/>
<circle
  cx={toX}
  cy={toY}
  r="4"
  fill={lineColor}
  stroke={lineColor}
  stroke-width="1"
/>

<style>
  .animated {
    stroke-dasharray: 5;
    animation: dash 0.5s linear infinite;
  }
  
  @keyframes dash {
    to {
      stroke-dashoffset: -10;
    }
  }
</style>
