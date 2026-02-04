// System 模块实体翻译
export const system = {
  // 用户表
  user: {
    _meta: {
      name: 'system_user',
      displayName: '系统用户',
      verboseName: '用户',
      verboseNamePlural: '用户列表',
    },
    fields: {
      deptId: '部门ID',
      parentId: '上级用户ID',
      roleId: '主角色ID',
      loginName: '登录账号',
      name: '用户昵称',
      userType: '用户类型',
      email: '用户邮箱',
      phonenumber: '手机号码',
      sex: '性别',
      avatar: '头像路径',
      password: '密码',
      salt: '密码盐',
      status: '账号状态',
      loginIp: '最后登录IP',
      loginDate: '最后登录时间',
      pwdUpdateDate: '密码更新时间',
      roleIds: '角色ID集合',
      postIds: '岗位ID集合',
      permissions: '权限集合',
    },
  },

  // 部门表
  department: {
    _meta: {
      name: 'system_department',
      displayName: '部门管理',
      verboseName: '部门',
      verboseNamePlural: '部门列表',
    },
    fields: {
      parentId: '父部门ID',
      ancestors: '祖级列表',
      name: '部门名称',
      orderNum: '显示排序',
      leader: '负责人',
      phone: '联系电话',
      email: '邮箱',
      status: '部门状态',
    },
  },

  // 角色表
  role: {
    _meta: {
      name: 'system_role',
      displayName: '角色管理',
      verboseName: '角色',
      verboseNamePlural: '角色列表',
    },
    fields: {
      name: '角色名称',
      key: '权限字符串',
      sort: '显示排序',
      dataScope: '数据范围',
      status: '状态',
      flag: '角色标识',
      menuIds: '菜单ID集合',
      deptIds: '部门ID集合',
      permissions: '权限集合',
    },
  },

  // 菜单表
  menu: {
    _meta: {
      name: 'system_menu',
      displayName: '菜单管理',
      verboseName: '菜单',
      verboseNamePlural: '菜单列表',
    },
    fields: {
      name: '菜单名称',
      parentId: '父菜单ID',
      orderNum: '显示排序',
      path: '路由地址',
      type: '菜单类型',
      visible: '是否显示',
      isCache: '是否缓存',
      isFrame: '是否外链',
      perms: '权限标识',
      icon: '菜单图标',
      component: '组件路径',
      remark: '备注',
    },
  },

  // 岗位表
  post: {
    _meta: {
      name: 'system_post',
      displayName: '岗位管理',
      verboseName: '岗位',
      verboseNamePlural: '岗位列表',
    },
    fields: {
      code: '岗位编码',
      name: '岗位名称',
      sort: '显示排序',
      status: '状态',
      flag: '岗位标识',
    },
  },

  // 字典表
  dict: {
    _meta: {
      name: 'system_dict',
      displayName: '字典数据',
      verboseName: '字典',
      verboseNamePlural: '字典列表',
    },
    fields: {
      group: '字典分组',
      label: '字典标签',
      value: '字典键值',
      sort: '字典排序',
      cssClass: '样式属性',
      listClass: '表格样式',
      isDefault: '是否默认',
      status: '状态',
      remark: '备注',
    },
  },

  // 字典分组表
  dictGroup: {
    _meta: {
      name: 'system_dict_group',
      displayName: '字典分组',
      verboseName: '字典分组',
      verboseNamePlural: '字典分组列表',
    },
    fields: {
      key: '分组键',
      name: '分组名称',
      status: '状态',
      remark: '备注',
    },
  },

  // 系统配置表
  config: {
    _meta: {
      name: 'system_config',
      displayName: '系统配置',
      verboseName: '配置',
      verboseNamePlural: '配置列表',
    },
    fields: {
      name: '配置名称',
      key: '配置键',
      value: '配置值',
      isSystem: '系统内置',
    },
  },

  // 通知公告表
  notice: {
    _meta: {
      name: 'system_notice',
      displayName: '通知公告',
      verboseName: '公告',
      verboseNamePlural: '公告列表',
    },
    fields: {
      title: '公告标题',
      type: '公告类型',
      content: '公告内容',
      status: '状态',
    },
  },

  // 定时任务表
  job: {
    _meta: {
      name: 'system_job',
      displayName: '定时任务',
      verboseName: '任务',
      verboseNamePlural: '任务列表',
    },
    fields: {
      name: '任务名称',
      group: '任务组名',
      invokeTarget: '调用目标',
      cronExpression: 'cron表达式',
      misfirePolicy: '错误策略',
      concurrent: '是否并发',
      status: '状态',
      nextValidTime: '下次执行时间',
      remark: '备注',
    },
  },

  // 任务日志表
  jobLog: {
    _meta: {
      name: 'system_job_log',
      displayName: '任务日志',
      verboseName: '任务日志',
      verboseNamePlural: '任务日志列表',
    },
    fields: {
      jobName: '任务名称',
      jobGroup: '任务组名',
      invokeTarget: '调用目标',
      jobMessage: '日志信息',
      status: '执行状态',
      exceptionInfo: '异常信息',
      startTime: '开始时间',
      stopTime: '结束时间',
    },
  },

  // 登录日志表
  loginInfo: {
    _meta: {
      name: 'system_login_info',
      displayName: '登录日志',
      verboseName: '登录日志',
      verboseNamePlural: '登录日志列表',
    },
    fields: {
      loginName: '登录账号',
      ipaddr: 'IP地址',
      loginLocation: '登录地点',
      browser: '浏览器',
      os: '操作系统',
      status: '登录状态',
      msg: '提示消息',
      loginTime: '登录时间',
    },
  },

  // 操作日志表
  operationLog: {
    _meta: {
      name: 'system_operation_log',
      displayName: '操作日志',
      verboseName: '操作日志',
      verboseNamePlural: '操作日志列表',
    },
    fields: {
      title: '操作模块',
      businessType: '业务类型',
      businessTypes: '业务类型数组',
      method: '请求方法',
      requestMethod: '请求方式',
      type: '操作类别',
      name: '操作人员',
      departmentName: '部门名称',
      url: '请求URL',
      ip: 'IP地址',
      location: '操作地点',
      param: '请求参数',
      jsonResult: '返回参数',
      status: '操作状态',
      errorMsg: '错误消息',
      time: '操作时间',
      costTime: '消耗时间',
    },
  },

  // 用户角色关联表
  userRole: {
    _meta: {
      name: 'system_user_role',
      displayName: '用户角色关联',
      verboseName: '用户角色',
      verboseNamePlural: '用户角色列表',
    },
    fields: {
      userId: '用户ID',
      roleId: '角色ID',
    },
  },

  // 用户岗位关联表
  userPost: {
    _meta: {
      name: 'system_user_post',
      displayName: '用户岗位关联',
      verboseName: '用户岗位',
      verboseNamePlural: '用户岗位列表',
    },
    fields: {
      userId: '用户ID',
      postId: '岗位ID',
    },
  },

  // 角色菜单关联表
  roleMenu: {
    _meta: {
      name: 'system_role_menu',
      displayName: '角色菜单关联',
      verboseName: '角色菜单',
      verboseNamePlural: '角色菜单列表',
    },
    fields: {
      roleId: '角色ID',
      menuId: '菜单ID',
    },
  },

  // 角色部门关联表
  roleDepartment: {
    _meta: {
      name: 'system_role_department',
      displayName: '角色部门关联',
      verboseName: '角色部门',
      verboseNamePlural: '角色部门列表',
    },
    fields: {
      roleId: '角色ID',
      departmentId: '部门ID',
    },
  },

  // 访问令牌表
  token: {
    _meta: {
      name: 'system_token',
      displayName: '访问令牌',
      verboseName: '令牌',
      verboseNamePlural: '令牌列表',
    },
    fields: {
      userId: '授权用户ID',
      userName: '授权用户名',
      name: '令牌名称',
      description: '令牌描述',
      tokenType: '令牌类型',
      tokenValue: '令牌值',
      tokenPrefix: '令牌前缀',
      tokenHash: '令牌哈希',
      issuedAt: '签发时间',
      expiresAt: '过期时间',
      lastUsedAt: '最后使用时间',
      scopes: '权限范围',
      granteeId: '被授权人ID',
      granteeType: '被授权人类型',
      clientId: '客户端ID',
      clientIp: '客户端IP',
      userAgent: '用户代理',
      isRevoked: '是否已撤销',
      revokedAt: '撤销时间',
      revokedBy: '撤销人',
      revokeReason: '撤销原因',
      metadata: '元数据',
    },
  },
};
