export const error = {
  // HTTP 错误
  http: {
    400: '请求参数错误',
    401: '未授权，请重新登录',
    403: '拒绝访问',
    404: '请求的资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时',
    default: '网络错误，请稍后重试',
  },
  // 业务错误
  business: {
    tokenExpired: '登录已过期，请重新登录',
    tokenInvalid: '无效的登录凭证',
    permissionDenied: '没有操作权限',
    dataNotFound: '数据不存在',
    dataExists: '数据已存在',
    operationFailed: '操作失败',
    uploadFailed: '上传失败',
    downloadFailed: '下载失败',
  },
  // 系统错误
  system: {
    admin: {
      cannot: {
        modify: '系统管理员用户不能修改',
        delete: '系统管理员用户不能删除',
      },
    },
    adminRole: {
      cannot: {
        modify: '管理员角色不能修改',
        delete: '管理员角色不能删除',
      },
    },
  },
  // 认证错误
  auth: {
    userNameOrPasswordError: '用户名或密码错误',
    userNameAndPasswordCannotBeEmpty: '用户名和密码不能为空',
    invalidRefreshToken: '无效的刷新令牌',
    refreshTokenExpired: '刷新令牌已过期',
    refreshTokenRevoked: '刷新令牌已失效',
    tokenNotProvided: '未提供令牌',
    invalidToken: '无效的令牌',
    userNotFound: '用户不存在',
    oldPasswordError: '原密码错误',
    passwordChangedSuccess: '密码修改成功，请重新登录',
    loginSuccess: '登录成功',
    logoutSuccess: '登出成功',
    refreshSuccess: '刷新成功',
    tokenValid: '令牌有效',
    fetchSuccess: '获取成功',
    serverError: '服务器内部错误',
  },
  // 网络错误
  network: {
    offline: '网络连接已断开',
    timeout: '请求超时，请检查网络',
    error: '网络错误，请稍后重试',
  },
};
