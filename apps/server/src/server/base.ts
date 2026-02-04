import { Elysia } from "elysia";

/**
 * 基础 Elysia 服务器实例
 * 不包含任何插件，保持最小化
 */
export const base = new Elysia({ name: "base" });
