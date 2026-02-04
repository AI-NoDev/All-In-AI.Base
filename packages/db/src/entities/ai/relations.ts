import { relations } from "drizzle-orm";
import { provider } from "./provider";
import { model } from "./model";
import { skill } from "./skill";
import { toolGroup } from "./toolGroup";
import { tool } from "./tool";
import { agent } from "./agent";
import { agentSession } from "./agentSession";
import { agentMessage } from "./agentMessage";
import { folder } from "../knowledge/folder";
import { file } from "../knowledge/file";

// 提供商关系
export const providerRelations = relations(provider, ({ many }) => ({
  models: many(model),
  agents: many(agent),
}));

// 模型关系
export const modelRelations = relations(model, ({ one, many }) => ({
  provider: one(provider, {
    fields: [model.providerId],
    references: [provider.id],
  }),
  agents: many(agent),
}));

// 技能关系
export const skillRelations = relations(skill, ({ one, many }) => ({
  parent: one(skill, {
    fields: [skill.parentId],
    references: [skill.id],
    relationName: "skillParent",
  }),
  children: many(skill, { relationName: "skillParent" }),
  folder: one(folder, {
    fields: [skill.folderId],
    references: [folder.id],
  }),
  file: one(file, {
    fields: [skill.fileId],
    references: [file.id],
  }),
}));

// 工具分组关系
export const toolGroupRelations = relations(toolGroup, ({ many }) => ({
  tools: many(tool),
}));

// 工具关系
export const toolRelations = relations(tool, ({ one }) => ({
  group: one(toolGroup, {
    fields: [tool.groupId],
    references: [toolGroup.id],
  }),
}));

// Agent 关系
export const agentRelations = relations(agent, ({ one, many }) => ({
  provider: one(provider, {
    fields: [agent.providerId],
    references: [provider.id],
  }),
  model: one(model, {
    fields: [agent.modelId],
    references: [model.id],
  }),
  sessions: many(agentSession),
}));

// Agent Session 关系
export const agentSessionRelations = relations(agentSession, ({ one, many }) => ({
  agent: one(agent, {
    fields: [agentSession.agentId],
    references: [agent.id],
  }),
  messages: many(agentMessage),
}));

// Agent Message 关系
export const agentMessageRelations = relations(agentMessage, ({ one }) => ({
  session: one(agentSession, {
    fields: [agentMessage.sessionId],
    references: [agentSession.id],
  }),
  model: one(model, {
    fields: [agentMessage.modelId],
    references: [model.id],
  }),
}));
