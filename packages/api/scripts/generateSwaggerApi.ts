import { generateApi } from "swagger-typescript-api";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAPI_URL = process.env.OPENAPI_URL || "http://localhost:3030/openapi/json";
const OUTPUT_FILE = path.resolve(__dirname, "../openapi.json");
const OUTPUT_DIR = path.resolve(__dirname, "..");

async function downloadOpenApi(): Promise<void> {
  console.log(`📥 Downloading OpenAPI spec from ${OPENAPI_URL}...`);
  
  const response = await fetch(OPENAPI_URL);
  
  if (!response.ok) {
    throw new Error(`Failed to download OpenAPI spec: ${response.status} ${response.statusText}`);
  }
  
  const spec = await response.json();
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(spec, null, 2));
  
  console.log(`✅ OpenAPI spec saved to ${OUTPUT_FILE}`);
}

async function generateApiClient(): Promise<void> {
  console.log(`🔧 Generating API client...`);
  
  await generateApi({
    input: OUTPUT_FILE,
    output: OUTPUT_DIR,
    fileName: "index.ts",
    httpClientType: "fetch",
    generateClient: true,
    generateRouteTypes: true,
    generateResponses: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractResponseBody: true,
    extractResponseError: true,
    unwrapResponseData: true,
    singleHttpClient: true,
    enumNamesAsValues: true,
    moduleNameFirstTag: true,
    sortTypes: true,
    sortRoutes: true,
  });
  
  console.log(`✅ API client generated successfully at ${OUTPUT_DIR}`);
}

async function main() {
  // 下载 OpenAPI spec
  await downloadOpenApi();
  
  // 生成 API 客户端
  await generateApiClient();
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
