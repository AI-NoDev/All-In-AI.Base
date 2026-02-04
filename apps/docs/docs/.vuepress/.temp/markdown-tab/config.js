import { CodeTabs } from "/Volumes/CP/codes/node/ai-drive-system/node_modules/.bun/@vuepress+plugin-markdown-tab@2.0.0-rc.86+b85d2674efebee98/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "/Volumes/CP/codes/node/ai-drive-system/node_modules/.bun/@vuepress+plugin-markdown-tab@2.0.0-rc.86+b85d2674efebee98/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "/Volumes/CP/codes/node/ai-drive-system/node_modules/.bun/@vuepress+plugin-markdown-tab@2.0.0-rc.86+b85d2674efebee98/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
