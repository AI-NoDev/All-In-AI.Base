/**
 * 通知状态管理
 * 管理未读通知数量，用于在侧边栏显示 badge
 */

import { authStore } from './auth.svelte';

class NotificationStore {
  unreadCount = $state(0);
  loading = $state(false);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  async fetchUnreadCount() {
    if (!authStore.isAuthenticated) {
      this.unreadCount = 0;
      return;
    }

    try {
      this.loading = true;
      const api = authStore.createApi(true);
      const res = await api.system.getApiSystemNoticeReadUnreadCount();
      this.unreadCount = res.data?.count ?? 0;
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    } finally {
      this.loading = false;
    }
  }

  /** 开始定时刷新未读数量 */
  startPolling(intervalMs = 60000) {
    this.stopPolling();
    this.fetchUnreadCount();
    this.intervalId = setInterval(() => {
      this.fetchUnreadCount();
    }, intervalMs);
  }

  /** 停止定时刷新 */
  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /** 标记已读后减少计数 */
  decrementCount(count = 1) {
    this.unreadCount = Math.max(0, this.unreadCount - count);
  }

  /** 重置计数 */
  reset() {
    this.unreadCount = 0;
    this.stopPolling();
  }
}

export const notificationStore = new NotificationStore();
