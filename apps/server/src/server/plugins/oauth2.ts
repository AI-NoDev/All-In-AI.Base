import { oauth2 } from "elysia-oauth2";
import { Elysia } from "elysia";

/**
 * OAuth2 插件
 * 需要配置环境变量:
 * - GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / GITHUB_REDIRECT_URI
 * - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI
 */
export const oauth2Plugin = new Elysia({ name: "plugin/oauth2" })
  .use(oauth2({
    GitHub: [
      Bun.env.GITHUB_CLIENT_ID || "",
      Bun.env.GITHUB_CLIENT_SECRET || "",
      Bun.env.GITHUB_REDIRECT_URI || "http://localhost:3000/auth/github/callback",
    ],
    Google: [
      Bun.env.GOOGLE_CLIENT_ID || "",
      Bun.env.GOOGLE_CLIENT_SECRET || "",
      Bun.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback",
    ],
  }));
