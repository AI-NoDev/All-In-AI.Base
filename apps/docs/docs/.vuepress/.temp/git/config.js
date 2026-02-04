import { GitContributors } from "/Volumes/CP/codes/node/ai-drive-system/node_modules/.bun/@vuepress+plugin-git@2.0.0-rc.88+dfbe318ad372587f/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "/Volumes/CP/codes/node/ai-drive-system/node_modules/.bun/@vuepress+plugin-git@2.0.0-rc.88+dfbe318ad372587f/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
