import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { config, jwtExpStrings } from "../../config";

// JWT Token 类型
export interface JwtPayload {
  sub: string;      // 用户 ID
  jti: string;      // Token 唯一标识
  type: "access" | "refresh";  // Token 类型
  scopes?: string[];  // 权限范围 (仅 access token)
  iat?: number;     // 签发时间
  exp?: number;     // 过期时间
}

export const jwtPlugin = new Elysia({ name: "plugin/jwt" })
  .use(jwt({
    name: "jwt",
    secret: config.jwt.secret,
    exp: jwtExpStrings.accessToken,
  }));
