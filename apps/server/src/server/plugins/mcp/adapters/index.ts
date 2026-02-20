import type { McpAdapter } from "../types";
import { defaultAdapter } from "./default";
import { cozeAdapter, cozeStatelessAdapter } from "./coze";

// Register all adapters in priority order (first match wins)
const adapters: McpAdapter[] = [
  cozeStatelessAdapter, // Highest priority - explicit stateless mode
  cozeAdapter,          // Coze with session management
  // Add more adapters here as needed
  // e.g., claudeAdapter, cursorAdapter, etc.
];

/**
 * Get the appropriate adapter for a request
 */
export function getAdapter(request: Request): McpAdapter {
  for (const adapter of adapters) {
    if (adapter.detect(request)) {
      console.log(`[MCP] Using adapter: ${adapter.name}`);
      return adapter;
    }
  }
  return defaultAdapter;
}

export { defaultAdapter } from "./default";
export { cozeAdapter, cozeStatelessAdapter } from "./coze";
