// 节点工具
export {
  generateId,
  sortNodesForParentChild,
  collectCascadeDeleteIds,
  updateSubflowChildNodeIds,
  type AllNodeData,
  type SubflowType,
} from './nodeUtils.js';

// 引脚类型工具
export {
  getOutputPinType,
  getOutputPinSchema,
  getInputPinType,
  validateConnection,
  validateConnectionWithReason,
  type ConnectionValidationResult,
} from './pinTypeUtils.js';

// 节点工厂
export {
  createActionNode,
  createStartNode,
  createUtilNode,
  createVariablePoolNode,
  createAssignNode,
  createNewLoopNode,
  createNewIfNode,
  type NodeDeleteHandler,
  type UtilConfigChangeHandler,
  type VariablesChangeHandler,
  type AssignTargetChangeHandler,
  type NewLoopNodeResult,
  type NewIfNodeResult,
  type ElseToggleHandler,
  type IfSizeChangeHandler,
} from './nodeFactories.js';

// 拖拽工具
export {
  detectTargetSubflow,
  moveNodeIntoSubflow,
  moveNodeOutOfSubflow,
  moveNodeBetweenSubflows,
  determineDragOperation,
  type SubflowDetectionResult,
  type DragOperation,
} from './dragUtils.js';

// 循环类型工具
export {
  calculateLoopItemType,
  updateLoopNodesType,
  type LoopTypeInfo,
} from './loopTypeUtils.js';

// Schema 模拟数据生成
export {
  generateFromSchema,
  generateMockInput,
  generateMockInputForUtil,
} from './schemaFaker.js';
