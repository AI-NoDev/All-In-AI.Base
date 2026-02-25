import { type JsonSchema } from '../types.js';
interface Props {
    schema?: JsonSchema;
    onchange?: (schema: JsonSchema) => void;
    locale?: 'zh' | 'en';
    class?: string;
    readonly?: boolean;
}
declare const JsonSchemaEditor: import("svelte").Component<Props, {
    getSchema: () => JsonSchema;
    setSchema: (newSchema: JsonSchema) => void;
    getJsonSchema: () => Record<string, unknown>;
}, "schema">;
type JsonSchemaEditor = ReturnType<typeof JsonSchemaEditor>;
export default JsonSchemaEditor;
