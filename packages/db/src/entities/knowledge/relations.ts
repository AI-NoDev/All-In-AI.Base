import { relations } from "drizzle-orm";
import { node } from "./node";
import { nodeVersion } from "./nodeVersion";
import { favorite } from "./favorite";

// 节点关系 (自引用 - 父子关系)
export const nodeRelations = relations(node, ({ one, many }) => ({
  parent: one(node, {
    fields: [node.parentId],
    references: [node.id],
    relationName: "nodeParent",
  }),
  children: many(node, { relationName: "nodeParent" }),
  versions: many(nodeVersion),
}));

// 节点版本关系
export const nodeVersionRelations = relations(nodeVersion, ({ one }) => ({
  node: one(node, {
    fields: [nodeVersion.nodeId],
    references: [node.id],
  }),
}));

// 收藏关系
export const favoriteRelations = relations(favorite, ({ one }) => ({
  node: one(node, {
    fields: [favorite.resourceId],
    references: [node.id],
  }),
}));
