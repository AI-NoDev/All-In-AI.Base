export const error = {
  // HTTP Errors
  http: {
    400: 'Bad Request',
    401: 'Unauthorized, please login again',
    403: 'Access Denied',
    404: 'Resource Not Found',
    405: 'Method Not Allowed',
    408: 'Request Timeout',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    default: 'Network error, please try again later',
  },
  // Business Errors
  business: {
    tokenExpired: 'Session expired, please login again',
    tokenInvalid: 'Invalid token',
    permissionDenied: 'Permission denied',
    dataNotFound: 'Data not found',
    dataExists: 'Data already exists',
    operationFailed: 'Operation failed',
    uploadFailed: 'Upload failed',
    downloadFailed: 'Download failed',
  },
  // System Errors
  system: {
    admin: {
      cannot: {
        modify: 'System administrator cannot be modified',
        delete: 'System administrator cannot be deleted',
      },
    },
    adminRole: {
      cannot: {
        modify: 'Admin role cannot be modified',
        delete: 'Admin role cannot be deleted',
      },
    },
  },
  // Auth Errors
  auth: {
    userNameOrPasswordError: 'Invalid username or password',
    userNameAndPasswordCannotBeEmpty: 'Username and password cannot be empty',
    invalidRefreshToken: 'Invalid refresh token',
    refreshTokenExpired: 'Refresh token expired',
    refreshTokenRevoked: 'Refresh token revoked',
    tokenNotProvided: 'Token not provided',
    invalidToken: 'Invalid token',
    userNotFound: 'User not found',
    oldPasswordError: 'Old password is incorrect',
    passwordChangedSuccess: 'Password changed successfully, please login again',
    loginSuccess: 'Login successful',
    logoutSuccess: 'Logout successful',
    refreshSuccess: 'Token refreshed',
    tokenValid: 'Token is valid',
    fetchSuccess: 'Fetch successful',
    serverError: 'Internal server error',
  },
  // Network Errors
  network: {
    offline: 'Network disconnected',
    timeout: 'Request timeout, please check your network',
    error: 'Network error, please try again later',
  },
};
