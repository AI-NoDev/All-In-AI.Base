import { Elysia, t } from 'elysia';
import { getSystemInfo, getDiskPartitions, getProcessList, getPortList, killProcess } from './collector';
import { queryMetrics, getLatestMetrics } from './storage';
import { onMetrics } from './scheduler';

export const monitorRouter = new Elysia({ prefix: '/api/monitor' })
  // 系统信息
  .get('/system/info', async () => {
    return await getSystemInfo();
  })
  
  // 磁盘分区
  .get('/disk/partitions', async () => {
    return await getDiskPartitions();
  })
  
  // 最新指标
  .get('/metrics/latest', () => {
    return getLatestMetrics();
  })
  
  // 历史指标查询
  .get('/metrics', ({ query }) => {
    const { type, range } = query;
    if (!type) {
      return { error: 'type is required' };
    }
    return queryMetrics(type, range || '24h');
  }, {
    query: t.Object({
      type: t.String(),
      range: t.Optional(t.String()),
    }),
  })
  
  // 进程列表
  .get('/processes', async ({ query }) => {
    const sortBy = (query.sortBy as 'cpu' | 'memory') || 'cpu';
    const limit = parseInt(query.limit || '20');
    return await getProcessList(sortBy, Math.min(limit, 100));
  }, {
    query: t.Object({
      sortBy: t.Optional(t.String()),
      limit: t.Optional(t.String()),
    }),
  })
  
  // 杀进程
  .post('/processes/:pid/kill', async ({ params }) => {
    const pid = parseInt(params.pid);
    if (isNaN(pid)) {
      return { success: false, error: 'Invalid PID' };
    }
    const success = await killProcess(pid);
    return { success };
  }, {
    params: t.Object({
      pid: t.String(),
    }),
  })
  
  // 端口列表
  .get('/ports', async () => {
    return await getPortList();
  });

/**
 * @deprecated This WebSocket router is deprecated. Use the new multi-channel WebSocket architecture instead.
 * See: apps/server/src/server/plugins/ws/channels/monitor.ts
 * The new architecture uses a single WebSocket connection at /ws/main with channel subscriptions.
 */
export const monitorWsRouter = new Elysia({ prefix: '/ws' })
  .ws('/metrics', {
    open(ws) {
      console.log('Monitor WebSocket connected:', ws.id);
      
      // 订阅指标更新
      const unsubscribe = onMetrics((snapshot) => {
        try {
          ws.send(JSON.stringify(snapshot));
        } catch (e) {
          console.error('Failed to send metrics:', e);
        }
      });
      
      // 存储取消订阅函数
      (ws.data as { unsubscribe?: () => void }).unsubscribe = unsubscribe;
    },
    
    close(ws) {
      console.log('Monitor WebSocket disconnected:', ws.id);
      const data = ws.data as { unsubscribe?: () => void };
      if (data.unsubscribe) {
        data.unsubscribe();
      }
    },
    
    message(ws, message) {
      // 可以处理客户端消息，如心跳
      if (message === 'ping') {
        ws.send('pong');
      }
    },
  });
