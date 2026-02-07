/**
 * 复杂示例数据 - 用于测试深层嵌套的 Schema
 * 
 * 结构示例：
 * - Array<Object> 嵌套
 * - Object 内含 Array<Object>
 * - Union 混合类型
 * - 多层嵌套组合
 */

import type { RootSchema, Field, ObjectSchema, ArraySchema, UnionSchema } from './types.js';

/**
 * 示例 1: API 响应结构
 * 模拟一个复杂的 API 响应，包含分页、用户列表、嵌套的订单和商品
 */
export const apiResponseExample: RootSchema = {
  type: 'object',
  id: 'root',
  fields: [
    {
      id: 'f_success',
      type: 'boolean',
      name: 'success',
      description: 'API 请求是否成功',
    },
    {
      id: 'f_code',
      type: 'number',
      name: 'code',
      description: '状态码',
    },
    {
      id: 'f_message',
      type: 'string',
      name: 'message',
      optional: true,
      description: '错误消息',
    },
    {
      id: 'f_data',
      type: 'object',
      name: 'data',
      description: '响应数据',
      fields: [
        {
          id: 'f_total',
          type: 'number',
          name: 'total',
          description: '总记录数',
        },
        {
          id: 'f_page',
          type: 'number',
          name: 'page',
          description: '当前页码',
        },
        {
          id: 'f_users',
          type: 'array',
          name: 'users',
          description: '用户列表',
          item: {
            id: 'f_user_item',
            type: 'object',
            fields: [
              { id: 'f_user_id', type: 'string', name: 'id' },
              { id: 'f_user_name', type: 'string', name: 'name' },
              { id: 'f_user_email', type: 'string', name: 'email', optional: true },
              {
                id: 'f_user_status',
                type: 'enum',
                name: 'status',
                values: ['active', 'inactive', 'pending'],
              },
              {
                id: 'f_user_orders',
                type: 'array',
                name: 'orders',
                description: '用户订单列表',
                optional: true,
                item: {
                  id: 'f_order_item',
                  type: 'object',
                  fields: [
                    { id: 'f_order_id', type: 'string', name: 'orderId' },
                    { id: 'f_order_amount', type: 'number', name: 'amount' },
                    {
                      id: 'f_order_items',
                      type: 'array',
                      name: 'items',
                      item: {
                        id: 'f_product_item',
                        type: 'object',
                        fields: [
                          { id: 'f_product_sku', type: 'string', name: 'sku' },
                          { id: 'f_product_name', type: 'string', name: 'productName' },
                          { id: 'f_product_qty', type: 'number', name: 'quantity' },
                          { id: 'f_product_price', type: 'number', name: 'price' },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

/**
 * 示例 2: 带 Union 的复杂结构
 * 模拟一个事件系统，不同事件类型有不同的 payload
 */
export const eventSystemExample: RootSchema = {
  type: 'object',
  id: 'root',
  fields: [
    {
      id: 'f_event_id',
      type: 'string',
      name: 'eventId',
      description: '事件唯一标识',
    },
    {
      id: 'f_timestamp',
      type: 'number',
      name: 'timestamp',
      description: '事件时间戳',
    },
    {
      id: 'f_event_type',
      type: 'enum',
      name: 'eventType',
      values: ['user_action', 'system_event', 'notification'],
    },
    {
      id: 'f_payload',
      type: 'union',
      name: 'payload',
      description: '事件负载（根据类型不同结构不同）',
      options: [
        // 用户操作事件
        {
          id: 'f_user_action_payload',
          type: 'object',
          fields: [
            { id: 'f_ua_user_id', type: 'string', name: 'userId' },
            { id: 'f_ua_action', type: 'string', name: 'action' },
            {
              id: 'f_ua_metadata',
              type: 'object',
              name: 'metadata',
              optional: true,
              fields: [
                { id: 'f_ua_ip', type: 'string', name: 'ip', optional: true },
                { id: 'f_ua_ua', type: 'string', name: 'userAgent', optional: true },
              ],
            },
          ],
        },
        // 系统事件
        {
          id: 'f_system_event_payload',
          type: 'object',
          fields: [
            { id: 'f_se_service', type: 'string', name: 'service' },
            {
              id: 'f_se_level',
              type: 'enum',
              name: 'level',
              values: ['info', 'warning', 'error', 'critical'],
            },
            { id: 'f_se_message', type: 'string', name: 'message' },
          ],
        },
        // 通知
        {
          id: 'f_notification_payload',
          type: 'object',
          fields: [
            {
              id: 'f_notif_recipients',
              type: 'array',
              name: 'recipients',
              item: { id: 'f_recipient', type: 'string' },
            },
            { id: 'f_notif_title', type: 'string', name: 'title' },
            { id: 'f_notif_body', type: 'string', name: 'body' },
            {
              id: 'f_notif_channels',
              type: 'array',
              name: 'channels',
              item: {
                id: 'f_channel',
                type: 'enum',
                values: ['email', 'sms', 'push', 'webhook'],
              },
            },
          ],
        },
      ],
    },
    {
      id: 'f_tags',
      type: 'array',
      name: 'tags',
      optional: true,
      item: { id: 'f_tag', type: 'string' },
    },
  ],
};

/**
 * 示例 3: 深层嵌套的组织架构
 * Array<Object{ Array<Object{ Array }> }>
 */
export const organizationExample: RootSchema = {
  type: 'object',
  id: 'root',
  fields: [
    {
      id: 'f_org_name',
      type: 'string',
      name: 'organizationName',
    },
    {
      id: 'f_departments',
      type: 'array',
      name: 'departments',
      description: '部门列表',
      item: {
        id: 'f_dept_item',
        type: 'object',
        fields: [
          { id: 'f_dept_id', type: 'string', name: 'deptId' },
          { id: 'f_dept_name', type: 'string', name: 'deptName' },
          {
            id: 'f_teams',
            type: 'array',
            name: 'teams',
            description: '团队列表',
            item: {
              id: 'f_team_item',
              type: 'object',
              fields: [
                { id: 'f_team_id', type: 'string', name: 'teamId' },
                { id: 'f_team_name', type: 'string', name: 'teamName' },
                {
                  id: 'f_members',
                  type: 'array',
                  name: 'members',
                  description: '成员列表',
                  item: {
                    id: 'f_member_item',
                    type: 'object',
                    fields: [
                      { id: 'f_member_id', type: 'string', name: 'memberId' },
                      { id: 'f_member_name', type: 'string', name: 'memberName' },
                      {
                        id: 'f_member_role',
                        type: 'enum',
                        name: 'role',
                        values: ['leader', 'senior', 'junior', 'intern'],
                      },
                      {
                        id: 'f_member_skills',
                        type: 'array',
                        name: 'skills',
                        optional: true,
                        item: {
                          id: 'f_skill_item',
                          type: 'object',
                          fields: [
                            { id: 'f_skill_name', type: 'string', name: 'skillName' },
                            {
                              id: 'f_skill_level',
                              type: 'enum',
                              name: 'level',
                              values: ['beginner', 'intermediate', 'advanced', 'expert'],
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

/**
 * 示例 4: 混合 Union 和 Array 的配置结构
 */
export const configExample: RootSchema = {
  type: 'object',
  id: 'root',
  fields: [
    {
      id: 'f_version',
      type: 'literal',
      name: 'version',
      value: '1.0',
    },
    {
      id: 'f_debug',
      type: 'boolean',
      name: 'debug',
      optional: true,
    },
    {
      id: 'f_plugins',
      type: 'array',
      name: 'plugins',
      description: '插件配置列表',
      item: {
        id: 'f_plugin_item',
        type: 'object',
        fields: [
          { id: 'f_plugin_name', type: 'string', name: 'name' },
          { id: 'f_plugin_enabled', type: 'boolean', name: 'enabled' },
          {
            id: 'f_plugin_config',
            type: 'union',
            name: 'config',
            description: '插件配置（不同插件配置不同）',
            options: [
              // 简单字符串配置
              { id: 'f_config_string', type: 'string' },
              // 数字配置
              { id: 'f_config_number', type: 'number' },
              // 复杂对象配置
              {
                id: 'f_config_object',
                type: 'object',
                fields: [
                  { id: 'f_cfg_timeout', type: 'number', name: 'timeout', optional: true },
                  { id: 'f_cfg_retries', type: 'number', name: 'retries', optional: true },
                  {
                    id: 'f_cfg_endpoints',
                    type: 'array',
                    name: 'endpoints',
                    optional: true,
                    item: {
                      id: 'f_endpoint_item',
                      type: 'object',
                      fields: [
                        { id: 'f_ep_url', type: 'string', name: 'url' },
                        { id: 'f_ep_weight', type: 'number', name: 'weight', optional: true },
                      ],
                    },
                  },
                ],
              },
              // 数组配置
              {
                id: 'f_config_array',
                type: 'array',
                item: { id: 'f_config_arr_item', type: 'string' },
              },
            ],
          },
        ],
      },
    },
  ],
};

/** 所有示例 */
export const examples = {
  apiResponse: apiResponseExample,
  eventSystem: eventSystemExample,
  organization: organizationExample,
  config: configExample,
};

export default examples;
