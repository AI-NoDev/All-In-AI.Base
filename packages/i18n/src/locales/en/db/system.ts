// System module entity translations
export const system = {
  user: {
    _meta: {
      name: 'system_user',
      displayName: 'System User',
      verboseName: 'User',
      verboseNamePlural: 'Users',
    },
    fields: {
      deptId: 'Department ID',
      parentId: 'Parent User ID',
      roleId: 'Primary Role ID',
      loginName: 'Login Name',
      name: 'Nickname',
      userType: 'User Type',
      email: 'Email',
      phonenumber: 'Phone Number',
      sex: 'Gender',
      avatar: 'Avatar',
      password: 'Password',
      salt: 'Password Salt',
      status: 'Status',
      loginIp: 'Last Login IP',
      loginDate: 'Last Login Time',
      pwdUpdateDate: 'Password Update Time',
      roleIds: 'Role IDs',
      postIds: 'Post IDs',
      permissions: 'Permissions',
    },
  },

  department: {
    _meta: {
      name: 'system_department',
      displayName: 'Department Management',
      verboseName: 'Department',
      verboseNamePlural: 'Departments',
    },
    fields: {
      parentId: 'Parent Department ID',
      ancestors: 'Ancestors',
      name: 'Department Name',
      orderNum: 'Sort Order',
      leader: 'Leader',
      phone: 'Phone',
      email: 'Email',
      status: 'Status',
    },
  },

  role: {
    _meta: {
      name: 'system_role',
      displayName: 'Role Management',
      verboseName: 'Role',
      verboseNamePlural: 'Roles',
    },
    fields: {
      name: 'Role Name',
      key: 'Permission Key',
      sort: 'Sort Order',
      dataScope: 'Data Scope',
      status: 'Status',
      flag: 'Role Flag',
      menuIds: 'Menu IDs',
      deptIds: 'Department IDs',
      permissions: 'Permissions',
    },
  },

  menu: {
    _meta: {
      name: 'system_menu',
      displayName: 'Menu Management',
      verboseName: 'Menu',
      verboseNamePlural: 'Menus',
    },
    fields: {
      name: 'Menu Name',
      parentId: 'Parent Menu ID',
      orderNum: 'Sort Order',
      path: 'Route Path',
      type: 'Menu Type',
      visible: 'Visible',
      isCache: 'Cache',
      isFrame: 'External Link',
      perms: 'Permission',
      icon: 'Icon',
      component: 'Component Path',
      remark: 'Remark',
    },
  },

  post: {
    _meta: {
      name: 'system_post',
      displayName: 'Post Management',
      verboseName: 'Post',
      verboseNamePlural: 'Posts',
    },
    fields: {
      code: 'Post Code',
      name: 'Post Name',
      sort: 'Sort Order',
      status: 'Status',
      flag: 'Post Flag',
    },
  },

  dict: {
    _meta: {
      name: 'system_dict',
      displayName: 'Dictionary Data',
      verboseName: 'Dictionary',
      verboseNamePlural: 'Dictionaries',
    },
    fields: {
      group: 'Dictionary Group',
      label: 'Label',
      value: 'Value',
      sort: 'Sort Order',
      cssClass: 'CSS Class',
      listClass: 'List Class',
      isDefault: 'Is Default',
      status: 'Status',
      remark: 'Remark',
    },
  },

  dictGroup: {
    _meta: {
      name: 'system_dict_group',
      displayName: 'Dictionary Group',
      verboseName: 'Dictionary Group',
      verboseNamePlural: 'Dictionary Groups',
    },
    fields: {
      key: 'Group Key',
      name: 'Group Name',
      status: 'Status',
      remark: 'Remark',
    },
  },

  config: {
    _meta: {
      name: 'system_config',
      displayName: 'System Config',
      verboseName: 'Config',
      verboseNamePlural: 'Configs',
    },
    fields: {
      name: 'Config Name',
      key: 'Config Key',
      value: 'Config Value',
      isSystem: 'System Built-in',
    },
  },

  notice: {
    _meta: {
      name: 'system_notice',
      displayName: 'Notice',
      verboseName: 'Notice',
      verboseNamePlural: 'Notices',
    },
    fields: {
      title: 'Notice Title',
      type: 'Notice Type',
      content: 'Content',
      status: 'Status',
    },
  },

  job: {
    _meta: {
      name: 'system_job',
      displayName: 'Scheduled Job',
      verboseName: 'Job',
      verboseNamePlural: 'Jobs',
    },
    fields: {
      name: 'Job Name',
      group: 'Job Group',
      invokeTarget: 'Invoke Target',
      cronExpression: 'Cron Expression',
      misfirePolicy: 'Misfire Policy',
      concurrent: 'Concurrent',
      status: 'Status',
      nextValidTime: 'Next Execution Time',
      remark: 'Remark',
    },
  },

  jobLog: {
    _meta: {
      name: 'system_job_log',
      displayName: 'Job Log',
      verboseName: 'Job Log',
      verboseNamePlural: 'Job Logs',
    },
    fields: {
      jobName: 'Job Name',
      jobGroup: 'Job Group',
      invokeTarget: 'Invoke Target',
      jobMessage: 'Log Message',
      status: 'Execution Status',
      exceptionInfo: 'Exception Info',
      startTime: 'Start Time',
      stopTime: 'End Time',
    },
  },

  loginInfo: {
    _meta: {
      name: 'system_login_info',
      displayName: 'Login Log',
      verboseName: 'Login Log',
      verboseNamePlural: 'Login Logs',
    },
    fields: {
      loginName: 'Login Name',
      ipaddr: 'IP Address',
      loginLocation: 'Login Location',
      browser: 'Browser',
      os: 'Operating System',
      status: 'Login Status',
      msg: 'Message',
      loginTime: 'Login Time',
    },
  },

  operationLog: {
    _meta: {
      name: 'system_operation_log',
      displayName: 'Operation Log',
      verboseName: 'Operation Log',
      verboseNamePlural: 'Operation Logs',
    },
    fields: {
      title: 'Module',
      businessType: 'Business Type',
      businessTypes: 'Business Types',
      method: 'Method',
      requestMethod: 'Request Method',
      type: 'Operator Type',
      name: 'Operator',
      departmentName: 'Department',
      url: 'Request URL',
      ip: 'IP Address',
      location: 'Location',
      param: 'Request Params',
      jsonResult: 'Response',
      status: 'Status',
      errorMsg: 'Error Message',
      time: 'Operation Time',
      costTime: 'Cost Time',
    },
  },

  userRole: {
    _meta: {
      name: 'system_user_role',
      displayName: 'User Role Association',
      verboseName: 'User Role',
      verboseNamePlural: 'User Roles',
    },
    fields: {
      userId: 'User ID',
      roleId: 'Role ID',
    },
  },

  userPost: {
    _meta: {
      name: 'system_user_post',
      displayName: 'User Post Association',
      verboseName: 'User Post',
      verboseNamePlural: 'User Posts',
    },
    fields: {
      userId: 'User ID',
      postId: 'Post ID',
    },
  },

  roleMenu: {
    _meta: {
      name: 'system_role_menu',
      displayName: 'Role Menu Association',
      verboseName: 'Role Menu',
      verboseNamePlural: 'Role Menus',
    },
    fields: {
      roleId: 'Role ID',
      menuId: 'Menu ID',
    },
  },

  roleDepartment: {
    _meta: {
      name: 'system_role_department',
      displayName: 'Role Department Association',
      verboseName: 'Role Department',
      verboseNamePlural: 'Role Departments',
    },
    fields: {
      roleId: 'Role ID',
      departmentId: 'Department ID',
    },
  },

  token: {
    _meta: {
      name: 'system_token',
      displayName: 'Access Token',
      verboseName: 'Token',
      verboseNamePlural: 'Tokens',
    },
    fields: {
      userId: 'User ID',
      userName: 'User Name',
      name: 'Token Name',
      description: 'Description',
      tokenType: 'Token Type',
      tokenValue: 'Token Value',
      tokenPrefix: 'Token Prefix',
      tokenHash: 'Token Hash',
      issuedAt: 'Issued At',
      expiresAt: 'Expires At',
      lastUsedAt: 'Last Used At',
      scopes: 'Scopes',
      granteeId: 'Grantee ID',
      granteeType: 'Grantee Type',
      clientId: 'Client ID',
      clientIp: 'Client IP',
      userAgent: 'User Agent',
      isRevoked: 'Is Revoked',
      revokedAt: 'Revoked At',
      revokedBy: 'Revoked By',
      revokeReason: 'Revoke Reason',
      metadata: 'Metadata',
    },
  },
};
