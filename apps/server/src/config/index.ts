/**
 * 服务器配置
 * 从环境变量读取，提供默认值
 */

export const config = {
  // 服务器配置
  port: parseInt(Bun.env.PORT || "3000"),
  
  // JWT 配置
  jwt: {
    secret: Bun.env.JWT_SECRET || "your-secret-key-change-in-production",
    // Access Token 过期时间 (分钟)
    accessTokenExpMinutes: parseInt(Bun.env.ACCESS_TOKEN_EXP_MINUTES || "15"),
    // Refresh Token 过期时间 (天)
    refreshTokenExpDays: parseInt(Bun.env.REFRESH_TOKEN_EXP_DAYS || "7"),
  },
  
  // 数据库配置
  database: {
    url: Bun.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/allinai",
  },
};

// 计算 JWT 过期时间字符串
export const jwtExpStrings = {
  accessToken: `${config.jwt.accessTokenExpMinutes}m`,
  refreshToken: `${config.jwt.refreshTokenExpDays}d`,
};

// 计算过期时间毫秒数
export const jwtExpMs = {
  accessToken: config.jwt.accessTokenExpMinutes * 60 * 1000,
  refreshToken: config.jwt.refreshTokenExpDays * 24 * 60 * 60 * 1000,
};

export default config;
