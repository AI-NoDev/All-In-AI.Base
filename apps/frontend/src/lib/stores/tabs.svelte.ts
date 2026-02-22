import { goto } from '$app/navigation';
import { routeTitles, pages } from '@/lib/generated-pages';

export type Tab = {
  path: string;
  title: string;
  closable?: boolean;
};

// Default i18n keys for tabs
const DEFAULT_DASHBOARD_TITLE = 'nav.title.dashboard';
const DEFAULT_UNKNOWN_TITLE = 'common.tips.noData';

// 匹配动态路由，返回对应的标题
function matchRouteTitle(path: string): string | undefined {
  // 先尝试精确匹配
  if (routeTitles[path]) {
    return routeTitles[path];
  }
  
  // 尝试匹配动态路由
  for (const page of pages) {
    // 将 [id] 等动态参数转换为正则
    const pattern = page.path.replace(/\[([^\]]+)\]/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      return page.title;
    }
  }
  
  return undefined;
}

function createTabsStore() {
  let tabs = $state<Tab[]>([{ path: '/dashboard', title: DEFAULT_DASHBOARD_TITLE, closable: false }]);
  let activeTab = $state('/dashboard');

  return {
    get tabs() {
      return tabs;
    },
    get activeTab() {
      return activeTab;
    },

    // 添加或激活标签页
    open(path: string, title?: string) {
      const existing = tabs.find((t) => t.path === path);
      if (!existing) {
        tabs = [
          ...tabs,
          {
            path,
            title: title || matchRouteTitle(path) || path.split('/').pop() || DEFAULT_UNKNOWN_TITLE,
            closable: path !== '/dashboard'
          }
        ];
      }
      activeTab = path;
    },

    // 关闭标签页
    close(path: string) {
      const index = tabs.findIndex((t) => t.path === path);
      if (index === -1 || !tabs[index].closable) return;

      // 如果关闭的是当前激活的标签，先切换到相邻标签
      if (activeTab === path) {
        const newTabs = tabs.filter((t) => t.path !== path);
        const newIndex = Math.min(index, newTabs.length - 1);
        const targetPath = newTabs[newIndex]?.path || '/dashboard';
        
        // 先跳转到相邻路由
        activeTab = targetPath;
        goto(targetPath).then(() => {
          // 跳转完成后再删除标签
          tabs = newTabs;
        });
      } else {
        // 关闭的不是当前标签，直接删除
        tabs = tabs.filter((t) => t.path !== path);
      }
    },

    // 关闭其他标签页
    closeOthers(path: string) {
      tabs = tabs.filter((t) => t.path === path || !t.closable);
      activeTab = path;
      goto(path);
    },

    // 关闭所有可关闭的标签页
    closeAll() {
      tabs = tabs.filter((t) => !t.closable);
      activeTab = tabs[0]?.path || '/dashboard';
      goto(activeTab);
    },

    // 同步当前路由
    sync(path: string) {
      if (path.startsWith('/dashboard')) {
        this.open(path);
      }
    }
  };
}

export const tabsStore = createTabsStore();
