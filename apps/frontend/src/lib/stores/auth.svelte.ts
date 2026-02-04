import { Api, HttpClient } from "@/lib/api/Api";
import { goto } from "$app/navigation";
import { t } from "@/lib/stores/i18n.svelte";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3030";

interface UserInfo {
  id: string;
  loginName: string;
  name: string | null;
  avatar: string | null;
  email: string | null;
  permissions: string[] | null;
}

interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExp: string | null;
  refreshTokenExp: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEYS = {
  accessToken: "auth_access_token",
  refreshToken: "auth_refresh_token",
  accessTokenExp: "auth_access_token_exp",
  refreshTokenExp: "auth_refresh_token_exp",
  user: "auth_user",
} as const;

function createAuthStore() {
  let state = $state<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    accessTokenExp: null,
    refreshTokenExp: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  let isRefreshing = false;
  let refreshPromise: Promise<boolean> | null = null;

  function loadFromStorage() {
    if (typeof window === "undefined") return;
    
    const accessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    const accessTokenExp = localStorage.getItem(STORAGE_KEYS.accessTokenExp);
    const refreshTokenExp = localStorage.getItem(STORAGE_KEYS.refreshTokenExp);
    const userStr = localStorage.getItem(STORAGE_KEYS.user);
    
    if (accessToken && refreshToken) {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.accessTokenExp = accessTokenExp;
      state.refreshTokenExp = refreshTokenExp;
      state.user = userStr ? JSON.parse(userStr) : null;
      state.isAuthenticated = true;
    }
  }

  function saveToStorage() {
    if (typeof window === "undefined") return;
    
    if (state.accessToken) localStorage.setItem(STORAGE_KEYS.accessToken, state.accessToken);
    if (state.refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, state.refreshToken);
    if (state.accessTokenExp) localStorage.setItem(STORAGE_KEYS.accessTokenExp, state.accessTokenExp);
    if (state.refreshTokenExp) localStorage.setItem(STORAGE_KEYS.refreshTokenExp, state.refreshTokenExp);
    if (state.user) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(state.user));
  }

  function clearStorage() {
    if (typeof window === "undefined") return;
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }

  function isTokenExpired(): boolean {
    if (!state.accessTokenExp) return true;
    return new Date(state.accessTokenExp) < new Date();
  }

  function isRefreshTokenExpired(): boolean {
    if (!state.refreshTokenExp) return true;
    return new Date(state.refreshTokenExp) < new Date();
  }

  async function doRefreshToken(): Promise<boolean> {
    if (!state.refreshToken || isRefreshTokenExpired()) {
      return false;
    }

    try {
      // 使用无拦截的 fetch 进行刷新，避免循环
      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: state.refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      if (result.success && result.data) {
        state.accessToken = result.data.accessToken;
        state.accessTokenExp = result.data.accessTokenExp;
        saveToStorage();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async function refreshAccessToken(): Promise<boolean> {
    // 防止并发刷新
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = doRefreshToken();

    try {
      const result = await refreshPromise;
      return result;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  async function handleUnauthorized(): Promise<void> {
    state.user = null;
    state.accessToken = null;
    state.refreshToken = null;
    state.accessTokenExp = null;
    state.refreshTokenExp = null;
    state.isAuthenticated = false;
    state.error = null;
    clearStorage();
    
    if (typeof window !== "undefined") {
      goto("/login");
    }
  }

  // 创建带有自动 token 处理的 customFetch
  const createCustomFetch = () => {
    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // 添加 Authorization header
      const headers = new Headers(init?.headers);
      if (state.accessToken && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${state.accessToken}`);
      }

      let modifiedInit: RequestInit = {
        ...init,
        headers,
      };

      // 对 POST/PUT 请求自动注入 createdBy/updatedBy
      const method = init?.method?.toUpperCase();
      if ((method === "POST" || method === "PUT") && init?.body && state.user) {
        const contentType = headers.get("Content-Type");
        if (contentType?.includes("application/json")) {
          try {
            const body = JSON.parse(init.body as string);
            // 只处理包含 data 字段的请求体
            if (body && typeof body === "object" && "data" in body && typeof body.data === "object") {
              const userName = state.user.name || state.user.loginName;
              const userId = state.user.id;
              
              if (method === "POST") {
                // 创建时设置 createdBy 和 updatedBy
                body.data = {
                  ...body.data,
                  createdBy: body.data.createdBy || userName,
                  createdById: body.data.createdById || userId,
                  updatedBy: body.data.updatedBy || userName,
                  updatedById: body.data.updatedById || userId,
                };
              } else if (method === "PUT") {
                // 更新时只设置 updatedBy
                body.data = {
                  ...body.data,
                  updatedBy: body.data.updatedBy || userName,
                  updatedById: body.data.updatedById || userId,
                };
              }
              
              modifiedInit.body = JSON.stringify(body);
            }
          } catch {
            // JSON 解析失败，保持原样
          }
        }
      }

      let response = await fetch(input, modifiedInit);

      // 处理 401 错误
      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        
        if (refreshed) {
          // 刷新成功，重试请求
          const retryHeaders = new Headers(modifiedInit.headers);
          retryHeaders.set("Authorization", `Bearer ${state.accessToken}`);
          
          response = await fetch(input, {
            ...modifiedInit,
            headers: retryHeaders,
          });
        } else {
          // 刷新失败，跳转登录
          await handleUnauthorized();
        }
      }

      return response;
    };
  };

  // 公共的 HttpClient 实例（带 token 和 401 处理）
  let sharedHttpClient: HttpClient | null = null;

  function getSharedHttpClient(): HttpClient {
    if (!sharedHttpClient) {
      sharedHttpClient = new HttpClient({
        baseUrl: API_BASE,
        customFetch: createCustomFetch() as typeof fetch,
      });
    }
    return sharedHttpClient;
  }

  // 重置 HttpClient（登录/登出后需要重建）
  function resetHttpClient() {
    sharedHttpClient = null;
  }

  // 创建 API 实例
  function createApi(withAuth = false): Api<unknown> {
    if (withAuth) {
      return new Api(getSharedHttpClient());
    }
    // 无需认证的请求使用独立的 HttpClient
    return new Api(new HttpClient({
      baseUrl: API_BASE,
    }));
  }

  async function login(loginName: string, password: string): Promise<boolean> {
    state.isLoading = true;
    state.error = null;
    
    try {
      const api = createApi(false);
      const response = await api.auth.postApiAuthLogin({ loginName, password });
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, accessTokenExp, refreshTokenExp, user } = response.data;
        
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.accessTokenExp = accessTokenExp;
        state.refreshTokenExp = refreshTokenExp;
        state.user = user;
        state.isAuthenticated = true;
        state.error = null;
        
        saveToStorage();
        resetHttpClient(); // 重建 HttpClient 以使用新 token
        return true;
      } else {
        const messageKey = response.message || "error.network.error";
        state.error = t(messageKey, messageKey);
        return false;
      }
    } catch (err: any) {
      const messageKey = err?.error?.message || "error.network.error";
      state.error = t(messageKey, messageKey);
      return false;
    } finally {
      state.isLoading = false;
    }
  }

  async function logout(): Promise<void> {
    try {
      if (state.accessToken) {
        const api = createApi(true);
        await api.auth.postApiAuthLogout();
      }
    } catch {
      // 忽略登出错误
    } finally {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExp = null;
      state.refreshTokenExp = null;
      state.isAuthenticated = false;
      state.error = null;
      clearStorage();
      resetHttpClient();
    }
  }

  async function verify(): Promise<boolean> {
    if (!state.accessToken) return false;
    
    if (isTokenExpired()) {
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        await logout();
        return false;
      }
    }
    
    try {
      const api = createApi(true);
      const response = await api.auth.getApiAuthVerify();
      return response.success;
    } catch {
      return false;
    }
  }

  async function fetchCurrentUser(): Promise<boolean> {
    if (!state.accessToken) return false;
    
    try {
      const api = createApi(true);
      const response = await api.auth.getApiAuthMe();
      
      if (response.success && response.data) {
        state.user = {
          id: response.data.id,
          loginName: response.data.loginName,
          name: response.data.name,
          avatar: response.data.avatar,
          email: response.data.email,
          permissions: response.data.permissions,
        };
        saveToStorage();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  loadFromStorage();

  return {
    get state() { return state; },
    get user() { return state.user; },
    get isAuthenticated() { return state.isAuthenticated; },
    get isLoading() { return state.isLoading; },
    get error() { return state.error; },
    get accessToken() { return state.accessToken; },
    login,
    logout,
    refreshAccessToken,
    verify,
    fetchCurrentUser,
    isTokenExpired,
    createApi,
  };
}

export const authStore = createAuthStore();
