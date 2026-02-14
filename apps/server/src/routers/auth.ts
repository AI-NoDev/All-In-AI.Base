import { Elysia, t } from "elysia";
import { eq, and } from "drizzle-orm";
import db from "@qiyu-allinai/db/connect";
import { user, loginInfo } from "@qiyu-allinai/db/entities/system";
import { config, jwtExpStrings, jwtExpMs } from "../config";
import { jwtPlugin } from "../server/plugins/jwt";
import { bearerPlugin } from "../server/plugins/bearer";

// i18n 消息 key - 后端返回 key，前端根据 key 渲染对应语言
const MSG = {
  userNameOrPasswordError: "error.auth.userNameOrPasswordError",
  invalidRefreshToken: "error.auth.invalidRefreshToken",
  refreshTokenExpired: "error.auth.refreshTokenExpired",
  refreshTokenRevoked: "error.auth.refreshTokenRevoked",
  tokenNotProvided: "error.auth.tokenNotProvided",
  invalidToken: "error.auth.invalidToken",
  userNotFound: "error.auth.userNotFound",
  oldPasswordError: "error.auth.oldPasswordError",
  passwordChangedSuccess: "error.auth.passwordChangedSuccess",
  loginSuccess: "error.auth.loginSuccess",
  logoutSuccess: "error.auth.logoutSuccess",
  refreshSuccess: "error.auth.refreshSuccess",
  tokenValid: "error.auth.tokenValid",
  fetchSuccess: "error.auth.fetchSuccess",
  serverError: "error.auth.serverError",
} as const;

// ============ Response Schemas ============
const UserInfoSchema = t.Object({
  id: t.String(),
  loginName: t.String(),
  name: t.Nullable(t.String()),
  avatar: t.Nullable(t.String()),
  email: t.Nullable(t.String()),
});

const UserDetailSchema = t.Object({
  id: t.String(),
  loginName: t.String(),
  name: t.Nullable(t.String()),
  avatar: t.Nullable(t.String()),
  email: t.Nullable(t.String()),
  phonenumber: t.Nullable(t.String()),
  sex: t.Nullable(t.String()),
  deptId: t.Nullable(t.String()),
  userType: t.Nullable(t.String()),
  loginDate: t.Nullable(t.Date()),
  loginIp: t.Nullable(t.String()),
});

const SuccessResponse = <T extends ReturnType<typeof t.Object>>(dataSchema: T) =>
  t.Object({
    success: t.Literal(true),
    message: t.String(),
    data: dataSchema,
  });

const ErrorResponse = t.Object({
  success: t.Literal(false),
  message: t.String(),
  data: t.Null(),
});

// ============ Helpers ============
function generateJti(): string {
  return crypto.randomUUID();
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function verifyPassword(password: string, salt: string, hashedPassword: string): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return hash === hashedPassword;
}

function getClientIp(request: Request, headers: Record<string, string | undefined>): string {
  const forwardedFor = headers["x-forwarded-for"];
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  
  const realIp = headers["x-real-ip"];
  if (realIp) return realIp;
  
  const cfConnectingIp = headers["cf-connecting-ip"];
  if (cfConnectingIp) return cfConnectingIp;
  
  try {
    return new URL(request.url).hostname;
  } catch {
    return "unknown";
  }
}

// 解析 User-Agent 获取浏览器和操作系统信息
function parseUserAgent(ua: string | undefined): { browser: string; os: string } {
  if (!ua) return { browser: "Unknown", os: "Unknown" };
  
  // 简单解析浏览器
  let browser = "Unknown";
  if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";
  
  // 简单解析操作系统
  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  
  return { browser, os };
}

// 记录登录日志
async function recordLoginLog(params: {
  loginName: string;
  ipaddr: string;
  browser: string;
  os: string;
  status: "0" | "1"; // 0=成功, 1=失败
  msg: string;
}) {
  try {
    await db.insert(loginInfo).values({
      loginName: params.loginName,
      ipaddr: params.ipaddr,
      browser: params.browser,
      os: params.os,
      status: params.status,
      msg: params.msg,
      loginTime: new Date(),
      createdBy: params.loginName,
      updatedBy: params.loginName,
    });
  } catch (error) {
    console.error("Failed to record login log:", error);
  }
}

// ============ Router ============
export const authRouter = new Elysia({ prefix: "/api/auth" })
  .use(bearerPlugin)
  .use(jwtPlugin)
  
  // ============ 登录 ============
  .post("/login", async ({ body, jwt, request, headers, set }) => {
    const { loginName, password } = body;
    const clientIp = getClientIp(request, headers);
    const { browser, os } = parseUserAgent(headers["user-agent"]);
    
    try {
      const [foundUser] = await db.select().from(user)
        .where(and(eq(user.loginName, loginName), eq(user.status, "0")))
        .limit(1);
      
      if (!foundUser) {
        // 记录登录失败日志
        await recordLoginLog({
          loginName,
          ipaddr: clientIp,
          browser,
          os,
          status: "1",
          msg: "用户不存在或已禁用",
        });
        set.status = 401;
        return { success: false as const, message: MSG.userNameOrPasswordError, data: null };
      }
      
      const isValid = await verifyPassword(password, foundUser.salt || "", foundUser.password || "");
      if (!isValid) {
        // 记录登录失败日志
        await recordLoginLog({
          loginName,
          ipaddr: clientIp,
          browser,
          os,
          status: "1",
          msg: "密码错误",
        });
        set.status = 401;
        return { success: false as const, message: MSG.userNameOrPasswordError, data: null };
      }
      
      const accessJti = generateJti();
      const accessToken = await jwt.sign({
        sub: foundUser.id,
        jti: accessJti,
        type: "access",
        // Note: permissions are now managed via Casbin, not stored in user table
        scopes: [],
      });
      
      const refreshJti = generateJti();
      const refreshToken = await jwt.sign({
        sub: foundUser.id,
        jti: refreshJti,
        type: "refresh",
        exp: jwtExpStrings.refreshToken,
      });
      
      const now = new Date();
      const accessExp = new Date(now.getTime() + jwtExpMs.accessToken);
      const refreshExp = new Date(now.getTime() + jwtExpMs.refreshToken);
      
      // 更新用户登录信息
      await db.update(user).set({
        loginDate: now,
        loginIp: clientIp,
      }).where(eq(user.id, foundUser.id));
      
      // 记录登录成功日志
      await recordLoginLog({
        loginName,
        ipaddr: clientIp,
        browser,
        os,
        status: "0",
        msg: "登录成功",
      });
      
      return {
        success: true as const,
        message: MSG.loginSuccess,
        data: {
          accessToken,
          refreshToken,
          accessTokenExp: accessExp.toISOString(),
          refreshTokenExp: refreshExp.toISOString(),
          expiresIn: config.jwt.accessTokenExpMinutes * 60,
          user: {
            id: foundUser.id,
            loginName: foundUser.loginName,
            name: foundUser.name,
            avatar: foundUser.avatar,
            email: foundUser.email,
          },
        },
      };
    } catch (error) {
      set.status = 500;
      return { success: false as const, message: MSG.serverError, data: null };
    }
  }, {
    body: t.Object({
      loginName: t.String({ minLength: 1 }),
      password: t.String({ minLength: 1 }),
    }),
    response: {
      200: SuccessResponse(t.Object({
        accessToken: t.String(),
        refreshToken: t.String(),
        accessTokenExp: t.String(),
        refreshTokenExp: t.String(),
        expiresIn: t.Number(),
        user: UserInfoSchema,
      })),
      401: ErrorResponse,
      500: ErrorResponse,
    },
    detail: { summary: "用户登录", description: "使用用户名密码登录，返回双 Token", tags: ["auth"] },
  })
  
  // ============ 刷新 Token ============
  .post("/refresh", async ({ body, jwt, set }) => {
    try {
      const { refreshToken } = body;
      
      const payload = await jwt.verify(refreshToken);
      if (!payload || payload.type !== "refresh") {
        set.status = 401;
        return { success: false as const, message: MSG.invalidRefreshToken, data: null };
      }
      
      // 检查 token 是否过期（JWT 自带过期验证，这里是双重检查）
      const exp = payload.exp as number | undefined;
      if (exp && exp * 1000 < Date.now()) {
        set.status = 401;
        return { success: false as const, message: MSG.refreshTokenExpired, data: null };
      }
      
      const [foundUser] = await db.select().from(user)
        .where(eq(user.id, payload.sub as string))
        .limit(1);
      
      if (!foundUser) {
        set.status = 401;
        return { success: false as const, message: MSG.userNotFound, data: null };
      }
      
      // 检查用户状态
      if (foundUser.status !== "0") {
        set.status = 401;
        return { success: false as const, message: MSG.userNotFound, data: null };
      }
      
      const accessJti = generateJti();
      const newAccessToken = await jwt.sign({
        sub: foundUser.id,
        jti: accessJti,
        type: "access",
        // Note: permissions are now managed via Casbin, not stored in user table
        scopes: [],
      });
      
      const now = new Date();
      const accessExp = new Date(now.getTime() + jwtExpMs.accessToken);
      
      return {
        success: true as const,
        message: MSG.refreshSuccess,
        data: {
          accessToken: newAccessToken,
          accessTokenExp: accessExp.toISOString(),
          expiresIn: config.jwt.accessTokenExpMinutes * 60,
        },
      };
    } catch (error) {
      set.status = 500;
      return { success: false as const, message: MSG.serverError, data: null };
    }
  }, {
    body: t.Object({ refreshToken: t.String({ minLength: 1 }) }),
    response: {
      200: SuccessResponse(t.Object({
        accessToken: t.String(),
        accessTokenExp: t.String(),
        expiresIn: t.Number(),
      })),
      401: ErrorResponse,
      500: ErrorResponse,
    },
    detail: { summary: "刷新访问令牌", description: "使用 Refresh Token 获取新的 Access Token", tags: ["auth"] },
  })
  
  // ============ 验证 Token ============
  .get("/verify", async ({ jwt, bearer, set }) => {
    try {
      if (!bearer) {
        set.status = 401;
        return { success: false as const, message: MSG.tokenNotProvided, data: null };
      }
      
      const payload = await jwt.verify(bearer);
      if (!payload) {
        set.status = 401;
        return { success: false as const, message: MSG.invalidToken, data: null };
      }
      
      const [foundUser] = await db.select().from(user)
        .where(eq(user.id, payload.sub as string))
        .limit(1);
      
      if (!foundUser) {
        set.status = 401;
        return { success: false as const, message: MSG.userNotFound, data: null };
      }
      
      return {
        success: true as const,
        message: MSG.tokenValid,
        data: {
          user: {
            id: foundUser.id,
            loginName: foundUser.loginName,
            name: foundUser.name,
            avatar: foundUser.avatar,
            email: foundUser.email,
          },
          tokenType: payload.type as string,
          scopes: (payload.scopes as string[]) || [],
        },
      };
    } catch (error) {
      set.status = 500;
      return { success: false as const, message: MSG.serverError, data: null };
    }
  }, {
    response: {
      200: SuccessResponse(t.Object({
        user: UserInfoSchema,
        tokenType: t.String(),
        scopes: t.Array(t.String()),
      })),
      401: ErrorResponse,
      500: ErrorResponse,
    },
    detail: { summary: "验证令牌", description: "验证 Access Token 是否有效", tags: ["auth"] },
  })
  
  // ============ 登出 ============
  .post("/logout", async ({ jwt, bearer, set }) => {
    try {
      if (!bearer) {
        set.status = 401;
        return { success: false as const, message: MSG.tokenNotProvided, data: null };
      }
      
      // JWT 是无状态的，登出只需要前端清除 token
      // 这里只验证 token 有效性，返回成功即可
      const payload = await jwt.verify(bearer);
      if (!payload) {
        // 即使 token 无效也返回成功，因为目的是登出
        return { success: true as const, message: MSG.logoutSuccess, data: null };
      }
      
      return { success: true as const, message: MSG.logoutSuccess, data: null };
    } catch (error) {
      // 登出时即使出错也返回成功
      return { success: true as const, message: MSG.logoutSuccess, data: null };
    }
  }, {
    response: {
      200: t.Object({
        success: t.Literal(true),
        message: t.String(),
        data: t.Null(),
      }),
      401: ErrorResponse,
      500: ErrorResponse,
    },
    detail: { summary: "用户登出", description: "撤销用户的所有刷新令牌", tags: ["auth"] },
  })
  
  // ============ 获取当前用户 ============
  .get("/me", async ({ jwt, bearer, set }) => {
    try {
      if (!bearer) {
        set.status = 401;
        return { success: false as const, message: MSG.tokenNotProvided, data: null };
      }
      
      const payload = await jwt.verify(bearer);
      if (!payload) {
        set.status = 401;
        return { success: false as const, message: MSG.invalidToken, data: null };
      }
      
      const [foundUser] = await db.select().from(user)
        .where(eq(user.id, payload.sub as string))
        .limit(1);
      
      if (!foundUser) {
        set.status = 401;
        return { success: false as const, message: MSG.userNotFound, data: null };
      }
      
      return {
        success: true as const,
        message: MSG.fetchSuccess,
        data: {
          id: foundUser.id,
          loginName: foundUser.loginName,
          name: foundUser.name,
          avatar: foundUser.avatar,
          email: foundUser.email,
          phonenumber: foundUser.phonenumber,
          sex: foundUser.sex,
          deptId: foundUser.deptId,
          userType: foundUser.userType,
          loginDate: foundUser.loginDate,
          loginIp: foundUser.loginIp,
        },
      };
    } catch (error) {
      set.status = 500;
      return { success: false as const, message: MSG.serverError, data: null };
    }
  }, {
    response: {
      200: SuccessResponse(UserDetailSchema),
      401: ErrorResponse,
      500: ErrorResponse,
    },
    detail: { summary: "获取当前用户", description: "获取当前登录用户的详细信息", tags: ["auth"] },
  })
  
  // ============ 修改密码 ============
  .put("/password", async ({ body, jwt, bearer, set }) => {
    try {
      if (!bearer) {
        set.status = 401;
        return { success: false as const, message: MSG.tokenNotProvided, data: null };
      }
      
      const payload = await jwt.verify(bearer);
      if (!payload) {
        set.status = 401;
        return { success: false as const, message: MSG.invalidToken, data: null };
      }
      
      const { oldPassword, newPassword } = body;
      
      const [foundUser] = await db.select().from(user)
        .where(eq(user.id, payload.sub as string))
        .limit(1);
      
      if (!foundUser) {
        set.status = 401;
        return { success: false as const, message: MSG.userNotFound, data: null };
      }
      
      const isValid = await verifyPassword(oldPassword, foundUser.salt || "", foundUser.password || "");
      if (!isValid) {
        set.status = 400;
        return { success: false as const, message: MSG.oldPasswordError, data: null };
      }
      
      const newSalt = generateSalt();
      const newHashedPassword = await hashPassword(newPassword, newSalt);
      
      await db.update(user).set({
        password: newHashedPassword,
        salt: newSalt,
        pwdUpdateDate: new Date(),
      }).where(eq(user.id, foundUser.id));
      
      // 密码修改后，前端需要重新登录（JWT 无状态，无法撤销已签发的 token）
      
      return { success: true as const, message: MSG.passwordChangedSuccess, data: null };
    } catch (error) {
      set.status = 500;
      return { success: false as const, message: MSG.serverError, data: null };
    }
  }, {
    body: t.Object({
      oldPassword: t.String({ minLength: 1 }),
      newPassword: t.String({ minLength: 6 }),
    }),
    response: {
      200: t.Object({
        success: t.Literal(true),
        message: t.String(),
        data: t.Null(),
      }),
      400: ErrorResponse,
      401: ErrorResponse,
      500: ErrorResponse,
    },
    detail: { summary: "修改密码", description: "修改当前用户密码", tags: ["auth"] },
  })
  
  // ============ 获取配置 ============
  .get("/config", () => ({
    success: true as const,
    message: MSG.fetchSuccess,
    data: {
      accessTokenExpMinutes: config.jwt.accessTokenExpMinutes,
      refreshTokenExpDays: config.jwt.refreshTokenExpDays,
    },
  }), {
    response: {
      200: SuccessResponse(t.Object({
        accessTokenExpMinutes: t.Number(),
        refreshTokenExpDays: t.Number(),
      })),
    },
    detail: { summary: "获取Token配置", description: "获取 Token 过期时间配置", tags: ["auth"] },
  });
