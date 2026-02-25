import { type RootSchema } from '../legacy-types.js';
interface Props {
    schema?: RootSchema;
    onSchemaChange?: (schema: RootSchema) => void;
    height?: string;
    title?: string;
}
declare const LegacyEditor: import("svelte").Component<Props, {
    getSchema: () => RootSchema;
    setSchema: (newSchema: RootSchema) => void;
}, "schema">;
type LegacyEditor = ReturnType<typeof LegacyEditor>;
export default LegacyEditor;
