/**
 * Skills Plugin - 生成 AI Skill 文件
 * 参考 Claude Agent Skills: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
 */

import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import { mcpServer } from '@qiyu-allinai/db/entities/ai';
import { dbActions, filesActions, devActions, wsActions } from '@qiyu-allinai/actions';
import db from '@qiyu-allinai/db/connect';
import { bearerPlugin } from './bearer';
import { jwtPlugin } from './jwt';

// 合并所有 actions，使用类型断言避免深度类型推断
const allActions = [...dbActions, ...filesActions, ...devActions, ...wsActions] as Array<{
  meta: { name: string; displayName: string; description: string; method: string; path: string };
  schemas: { bodySchema?: unknown; paramsSchema?: unknown; querySchema?: unknown };
}>;

interface ActionInfo {
  name: string;
  displayName: string;
  description: string;
  method: string;
  path: string;
  hasBody: boolean;
  hasParams: boolean;
  hasQuery: boolean;
  bodySchema: unknown;
  paramsSchema: unknown;
  querySchema: unknown;
}

function generateActionDoc(action: ActionInfo, baseUrl: string, skillName: string): string {
  let md = `# ${action.displayName}

**Action 名称:** \`${action.name}\`

${action.description}

## 基本信息

- **HTTP 方法:** ${action.method}
- **路径:** ${action.path}

## 使用方式

\`\`\`bash
node .claude/skills/${skillName}/scripts/fetch.js ${action.name} --input '<JSON>'
\`\`\`

`;

  if (action.hasParams) {
    md += `## 路径参数 (paramsSchema)

\`\`\`json
${JSON.stringify(action.paramsSchema, null, 2)}
\`\`\`

`;
  }

  if (action.hasQuery) {
    md += `## 查询参数 (querySchema)

\`\`\`json
${JSON.stringify(action.querySchema, null, 2)}
\`\`\`

`;
  }

  if (action.hasBody) {
    md += `## 请求体 (bodySchema)

\`\`\`json
${JSON.stringify(action.bodySchema, null, 2)}
\`\`\`

`;
  }

  // 生成示例
  const inputExample: Record<string, unknown> = {};
  if (action.hasBody) inputExample.body = {};
  if (action.hasParams) inputExample.params = {};
  if (action.hasQuery) inputExample.query = {};

  md += `## 示例

\`\`\`bash
node .claude/skills/${skillName}/scripts/fetch.js ${action.name} --input '${JSON.stringify(inputExample)}'
\`\`\`

## 直接 API 调用

\`\`\`bash
curl -X ${action.method} "${baseUrl}${action.path}" \\
  -H "Authorization: Bearer <TOKEN>" \\
  -H "Content-Type: application/json"${action.hasBody ? " \\\n  -d '<JSON>'" : ''}
\`\`\`
`;

  return md;
}

function generateSkillMd(
  name: string,
  description: string | null,
  actions: ActionInfo[],
  skillName: string,
  baseUrl: string,
  isPublic: boolean
): string {
  let md = `# ${name}

${description || '此 Skill 提供一组 API 工具供 AI 调用。'}

## 配置

**API 地址:** \`${baseUrl}\`

`;

  if (!isPublic) {
    md += `**认证方式:** Bearer Token

在使用前，请确保已配置认证 Token：
- 方式一：设置环境变量 \`QIYUAI_AUTH_TOKEN\`
- 方式二：在 \`scripts/fetch.js\` 顶部设置 \`AUTH_TOKEN\` 常量
- 方式三：使用 \`--authtoken\` 参数传入

`;
  }

  md += `## 快速开始

\`\`\`bash
# 查看所有可用 actions
node .claude/skills/${skillName}/scripts/fetch.js -h

# 查看单个 action 的详细帮助
node .claude/skills/${skillName}/scripts/fetch.js --action <actionName> -h

# 调用 action
node .claude/skills/${skillName}/scripts/fetch.js <actionName> --input '<JSON>'
\`\`\`

## 可用 Actions

| Action 名称 | 说明 | 文档 |
|-------------|------|------|
`;

  for (const action of actions) {
    md += `| \`${action.name}\` | ${action.displayName} | [docs/${action.name}.md](docs/${action.name}.md) |\n`;
  }

  md += `
## 参数说明

- \`-h, --help\`: 显示帮助信息
- \`--action <name> -h\`: 显示指定 action 的详细帮助
- \`--input <JSON>\`: JSON 格式的输入参数
- \`--authtoken <token>\`: 认证 Token（可选）

## 输入参数格式

输入参数为 JSON 对象，可包含以下字段：

\`\`\`json
{
  "params": {},   // 路径参数，如 { "id": "xxx" }
  "query": {},    // 查询参数，如 { "limit": 10 }
  "body": {}      // 请求体，如 { "data": {...} }
}
\`\`\`

## 详细文档

每个 action 的详细文档位于 \`docs/\` 目录：

`;

  for (const action of actions) {
    md += `- [${action.name}](docs/${action.name}.md) - ${action.displayName}\n`;
  }

  return md;
}

function generateFetchJs(
  baseUrl: string,
  isPublic: boolean,
  skillName: string,
  actions: ActionInfo[]
): string {
  // 生成 actions 帮助信息
  const actionsHelp = actions.map(a => 
    `    "${a.name}": { displayName: "${a.displayName}", description: "${a.description.replace(/"/g, '\\"')}", method: "${a.method}", path: "${a.path}", hasBody: ${a.hasBody}, hasParams: ${a.hasParams}, hasQuery: ${a.hasQuery} }`
  ).join(',\n');

  return `#!/usr/bin/env node
/**
 * QiyuAI Skill Fetch Script - ${skillName}
 * 用于 AI Agent 调用 API
 * 
 * 使用方式:
 *   node fetch.js -h                           # 显示所有可用 actions
 *   node fetch.js --action <name> -h           # 显示指定 action 的帮助
 *   node fetch.js <actionName> --input "<JSON>" [--authtoken <token>]
 */

// ============ 配置区域 ============
// 方式一：直接在此处设置 Token（优先级最低）
const AUTH_TOKEN = '';

// 方式二：通过环境变量 QIYUAI_AUTH_TOKEN 设置
// 方式三：通过命令行参数 --authtoken 设置（优先级最高）
// ================================

const BASE_URL = '${baseUrl}';
const IS_PUBLIC = ${isPublic};
const SKILL_NAME = '${skillName}';

// 可用的 Actions
const ACTIONS = {
${actionsHelp}
};

function showHelp() {
  console.log(\`
${skillName} - QiyuAI Skill

Usage:
  node fetch.js -h                           显示此帮助信息
  node fetch.js --action <name> -h           显示指定 action 的详细帮助
  node fetch.js <actionName> --input "<JSON>" [--authtoken <token>]

Available Actions:
\`);
  
  for (const [name, info] of Object.entries(ACTIONS)) {
    console.log(\`  \${name.padEnd(45)} \${info.displayName}\`);
  }
  
  console.log(\`
Options:
  -h, --help              显示帮助信息
  --action <name> -h      显示指定 action 的详细帮助
  --input <JSON>          JSON 格式的输入参数
  --authtoken <token>     认证 Token（可选）

Documentation:
  每个 action 的详细文档位于 docs/ 目录
  例如: docs/\${Object.keys(ACTIONS)[0]}.md
\`);
}

function showActionHelp(actionName) {
  const action = ACTIONS[actionName];
  if (!action) {
    console.error(\`Error: Action "\${actionName}" 不存在\`);
    console.error(\`使用 -h 查看所有可用的 actions\`);
    process.exit(1);
  }
  
  console.log(\`
${skillName} - \${action.displayName}

Action: \${actionName}
Method: \${action.method}
Path:   \${action.path}

Description:
  \${action.description}

Usage:
  node fetch.js \${actionName} --input '<JSON>'

Input Format:
  {
\${action.hasParams ? '    "params": {},   // 路径参数\\n' : ''}\${action.hasQuery ? '    "query": {},    // 查询参数\\n' : ''}\${action.hasBody ? '    "body": {}      // 请求体\\n' : ''}  }

Example:
  node fetch.js \${actionName} --input '{\${action.hasBody ? '"body":{}' : ''}\${action.hasParams ? '"params":{}' : ''}\${action.hasQuery ? '"query":{}' : ''}}'

Documentation:
  详细文档请查看: docs/\${actionName}.md
\`);
}

async function main() {
  const args = process.argv.slice(2);
  
  // 检查 -h 或 --help
  if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
    showHelp();
    process.exit(0);
  }
  
  // 检查 --action xxx -h
  const actionIndex = args.indexOf('--action');
  if (actionIndex !== -1) {
    const actionName = args[actionIndex + 1];
    if (args.includes('-h') || args.includes('--help')) {
      showActionHelp(actionName);
      process.exit(0);
    }
  }
  
  // 获取 action 名称
  let actionName = args[0];
  
  // 如果第一个参数是 --action，则取下一个参数
  if (actionName === '--action' && args[1]) {
    actionName = args[1];
  }
  
  // 验证 action 是否存在
  if (!ACTIONS[actionName]) {
    console.error(\`Error: Action "\${actionName}" 不存在\`);
    console.error(\`使用 -h 查看所有可用的 actions\`);
    process.exit(1);
  }
  
  let inputJson = '{}';
  let cliToken = '';

  // 解析参数
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      inputJson = args[i + 1];
      i++;
    } else if (args[i] === '--authtoken' && args[i + 1]) {
      cliToken = args[i + 1];
      i++;
    }
  }

  // Token 优先级：命令行 > 环境变量 > 配置常量
  const token = cliToken || process.env.QIYUAI_AUTH_TOKEN || AUTH_TOKEN;

  if (!IS_PUBLIC && !token) {
    console.error('Error: 认证 Token 未配置');
    console.error('请通过以下方式之一配置 Token：');
    console.error('  1. 设置环境变量 QIYUAI_AUTH_TOKEN');
    console.error('  2. 在 fetch.js 顶部设置 AUTH_TOKEN 常量');
    console.error('  3. 使用 --authtoken 参数传入');
    process.exit(1);
  }

  let input;
  try {
    input = JSON.parse(inputJson);
  } catch (e) {
    console.error('Error: 无法解析 --input 参数，请确保是有效的 JSON 格式');
    process.exit(1);
  }

  const url = \`\${BASE_URL}/api/actions/execute/\${actionName}\`;
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (!IS_PUBLIC && token) {
    headers['Authorization'] = \`Bearer \${token}\`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(input),
    });

    const result = await response.json();
    
    if (response.ok && result.status === 200) {
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.error('API Error:', result.message || 'Unknown error');
      console.error('Status:', result.status);
      process.exit(1);
    }
  } catch (error) {
    console.error('Request Error:', error.message);
    process.exit(1);
  }
}

main();
`;
}

/** Skill 文件 Schema */
const skillFileSchema = t.Object({
  path: t.String({ description: '文件相对路径' }),
  content: t.String({ description: '文件内容' }),
});

/** Skill 输出 Schema */
const skillOutputSchema = t.Object({
  skillName: t.String({ description: 'Skill 名称（基于 MCP 服务名）' }),
  files: t.Array(skillFileSchema, { description: '生成的文件列表' }),
});

async function generateSkillFiles(serverId: string): Promise<{ skillName: string; files: Array<{ path: string; content: string }> } | null> {
  const [server] = await db.select().from(mcpServer).where(eq(mcpServer.id, serverId)).limit(1);
  if (!server) return null;

  const baseUrl = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 3030}`;
  const skillName = server.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // 构建 actions 信息
  const actionsMap = new Map(allActions.map(a => [a.meta.name, a]));
  const actionInfos: ActionInfo[] = [];
  
  for (const actionName of server.actions) {
    const action = actionsMap.get(actionName);
    if (!action) continue;
    
    actionInfos.push({
      name: action.meta.name,
      displayName: action.meta.displayName,
      description: action.meta.description,
      method: action.meta.method,
      path: action.meta.path,
      hasBody: !!action.schemas.bodySchema,
      hasParams: !!action.schemas.paramsSchema,
      hasQuery: !!action.schemas.querySchema,
      bodySchema: action.schemas.bodySchema,
      paramsSchema: action.schemas.paramsSchema,
      querySchema: action.schemas.querySchema,
    });
  }

  // 生成文件列表
  const files: Array<{ path: string; content: string }> = [];

  // 1. 生成 SKILL.md
  const skillMd = generateSkillMd(server.name, server.description, actionInfos, skillName, baseUrl, server.isPublic);
  files.push({ path: `SKILL.md`, content: skillMd });

  // 2. 生成 fetch.js
  const fetchJs = generateFetchJs(baseUrl, server.isPublic, skillName, actionInfos);
  files.push({ path: `scripts/fetch.js`, content: fetchJs });

  // 3. 为每个 action 生成单独的文档
  for (const action of actionInfos) {
    const actionDoc = generateActionDoc(action, baseUrl, skillName);
    files.push({ path: `docs/${action.name}.md`, content: actionDoc });
  }

  return { skillName, files };
}

export const skillsPlugin = new Elysia({ name: 'plugin/skills' })
  .use(bearerPlugin)
  .use(jwtPlugin)
  .get('/api/ai/mcp-server/:id/skill', async ({ params, set }) => {
    const result = await generateSkillFiles(params.id);
    if (!result) {
      set.status = 404;
      return { data: null, status: 404, message: 'MCP server not found' };
    }

    // 添加完整路径前缀
    const filesWithPath = result.files.map(f => ({
      path: `.claude/skills/${result.skillName}/${f.path}`,
      content: f.content,
    }));

    return {
      data: { skillName: result.skillName, files: filesWithPath },
      status: 200,
      message: 'ok',
    };
  }, {
    params: t.Object({ id: t.String() }),
    response: {
      200: t.Object({
        data: skillOutputSchema,
        status: t.Number({ default: 200 }),
        message: t.String({ default: 'ok' }),
      }),
      404: t.Object({
        data: t.Null(),
        status: t.Number({ default: 404 }),
        message: t.String(),
      }),
    },
    detail: {
      tags: ['AI', 'MCP'],
      summary: '生成 AI Skill',
      description: `为 MCP 服务生成标准 AI Skill 文件包，可用于 Claude Desktop 等 AI 工具。

**生成的文件结构：**
\`\`\`
.claude/skills/{mcpName}/
├── SKILL.md              # Skill 说明文档
├── scripts/
│   └── fetch.js          # API 调用脚本
└── docs/
    └── {action}.md       # 每个 action 的详细文档
\`\`\`

**使用方式：**
1. 下载生成的 Skill 文件
2. 解压到项目根目录
3. 配置环境变量 QIYUAI_AUTH_TOKEN 或在 fetch.js 中设置 AUTH_TOKEN
4. 使用 \`node fetch.js -h\` 查看所有可用 actions
5. 使用 \`node fetch.js --action <name> -h\` 查看单个 action 帮助`,
    },
  })
  // ZIP 下载端点
  .get('/api/ai/mcp-server/:id/skill/download', async ({ params, set }) => {
    const result = await generateSkillFiles(params.id);
    if (!result) {
      set.status = 404;
      return new Response('MCP server not found', { status: 404 });
    }

    // 使用 Bun 的 zip 功能创建 ZIP
    const zipFiles: Record<string, string> = {};
    for (const file of result.files) {
      // 文件路径格式: .claude/skills/{skillName}/xxx
      zipFiles[`.claude/skills/${result.skillName}/${file.path}`] = file.content;
    }

    // 创建 ZIP 文件
    const zipBuffer = await createZipBuffer(zipFiles);
    
    set.headers['Content-Type'] = 'application/zip';
    set.headers['Content-Disposition'] = `attachment; filename="${result.skillName}-skill.zip"`;
    
    // 使用 Buffer.from 转换 Uint8Array 为 BodyInit 兼容类型
    return new Response(Buffer.from(zipBuffer));
  }, {
    params: t.Object({ id: t.String() }),
    detail: {
      tags: ['AI', 'MCP'],
      summary: '下载 AI Skill ZIP',
      description: '下载 MCP 服务的 AI Skill 文件包（ZIP 格式）',
    },
  });

/**
 * 创建 ZIP 文件 Buffer
 * 使用简单的 ZIP 格式实现
 */
async function createZipBuffer(files: Record<string, string>): Promise<Uint8Array> {
  const entries: Array<{ name: string; data: Uint8Array }> = [];
  
  for (const [name, content] of Object.entries(files)) {
    entries.push({
      name,
      data: new TextEncoder().encode(content),
    });
  }
  
  // ZIP 文件结构
  const localHeaders: Uint8Array[] = [];
  const centralHeaders: Uint8Array[] = [];
  let offset = 0;
  
  for (const entry of entries) {
    const nameBytes = new TextEncoder().encode(entry.name);
    const crc = crc32(entry.data);
    
    // Local file header
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    
    localView.setUint32(0, 0x04034b50, true); // signature
    localView.setUint16(4, 20, true); // version needed
    localView.setUint16(6, 0, true); // flags
    localView.setUint16(8, 0, true); // compression (store)
    localView.setUint16(10, 0, true); // mod time
    localView.setUint16(12, 0, true); // mod date
    localView.setUint32(14, crc, true); // crc32
    localView.setUint32(18, entry.data.length, true); // compressed size
    localView.setUint32(22, entry.data.length, true); // uncompressed size
    localView.setUint16(26, nameBytes.length, true); // filename length
    localView.setUint16(28, 0, true); // extra field length
    localHeader.set(nameBytes, 30);
    
    localHeaders.push(localHeader);
    localHeaders.push(entry.data);
    
    // Central directory header
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    
    centralView.setUint32(0, 0x02014b50, true); // signature
    centralView.setUint16(4, 20, true); // version made by
    centralView.setUint16(6, 20, true); // version needed
    centralView.setUint16(8, 0, true); // flags
    centralView.setUint16(10, 0, true); // compression
    centralView.setUint16(12, 0, true); // mod time
    centralView.setUint16(14, 0, true); // mod date
    centralView.setUint32(16, crc, true); // crc32
    centralView.setUint32(20, entry.data.length, true); // compressed size
    centralView.setUint32(24, entry.data.length, true); // uncompressed size
    centralView.setUint16(28, nameBytes.length, true); // filename length
    centralView.setUint16(30, 0, true); // extra field length
    centralView.setUint16(32, 0, true); // comment length
    centralView.setUint16(34, 0, true); // disk number
    centralView.setUint16(36, 0, true); // internal attrs
    centralView.setUint32(38, 0, true); // external attrs
    centralView.setUint32(42, offset, true); // local header offset
    centralHeader.set(nameBytes, 46);
    
    centralHeaders.push(centralHeader);
    offset += localHeader.length + entry.data.length;
  }
  
  // End of central directory
  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const h of centralHeaders) {
    centralDirSize += h.length;
  }
  
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  
  endView.setUint32(0, 0x06054b50, true); // signature
  endView.setUint16(4, 0, true); // disk number
  endView.setUint16(6, 0, true); // central dir disk
  endView.setUint16(8, entries.length, true); // entries on disk
  endView.setUint16(10, entries.length, true); // total entries
  endView.setUint32(12, centralDirSize, true); // central dir size
  endView.setUint32(16, centralDirOffset, true); // central dir offset
  endView.setUint16(20, 0, true); // comment length
  
  // Combine all parts
  const totalSize = offset + centralDirSize + 22;
  const result = new Uint8Array(totalSize);
  let pos = 0;
  
  for (const h of localHeaders) {
    result.set(h, pos);
    pos += h.length;
  }
  for (const h of centralHeaders) {
    result.set(h, pos);
    pos += h.length;
  }
  result.set(endRecord, pos);
  
  return result;
}

/**
 * CRC32 计算
 */
function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  const table = getCrc32Table();
  
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xff];
  }
  
  return (crc ^ 0xffffffff) >>> 0;
}

let crc32Table: Uint32Array | null = null;

function getCrc32Table(): Uint32Array {
  if (crc32Table) return crc32Table;
  
  crc32Table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crc32Table[i] = c;
  }
  
  return crc32Table;
}
