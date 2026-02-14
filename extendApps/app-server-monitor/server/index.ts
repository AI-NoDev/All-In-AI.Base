import { Elysia } from 'elysia';
import { collectMetrics, getMetricsHistory } from '../actions';

// ServerMonitor Elysia 插件 - 仅处理 WebSocket
export const appServerMonitorPlugin = new Elysia({ prefix: '/api/app-server-monitor' })
  .onStart(() => {
    console.log('📊 Server monitor plugin started');
  })
  // WebSocket 实时推送
  .ws('/ws', {
    open(ws) {
      console.log('📊 Monitor WebSocket connected');
      // 立即发送当前数据
      collectMetrics().then(metrics => {
        ws.send(JSON.stringify({ type: 'metrics', data: metrics }));
      });
    },
    message(ws, message) {
      // 处理客户端消息
      try {
        const msg = typeof message === 'string' ? JSON.parse(message) : message;
        if (msg.type === 'getHistory') {
          ws.send(JSON.stringify({ type: 'history', data: getMetricsHistory() }));
        } else if (msg.type === 'getMetrics') {
          collectMetrics().then(metrics => {
            ws.send(JSON.stringify({ type: 'metrics', data: metrics }));
          });
        }
      } catch {
        // 忽略解析错误
      }
    },
    close() {
      console.log('📊 Monitor WebSocket disconnected');
    },
  });
