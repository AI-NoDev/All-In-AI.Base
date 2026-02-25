import FieldItem from "./field-item.svelte";
import { type Field } from '../types.js';
interface Props {
    field: Field;
    locale?: 'zh' | 'en';
    readonly?: boolean;
    onEdit?: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onUpdate: (field: Field) => void;
}
declare const FieldItem: import("svelte").Component<Props, {}, "">;
type FieldItem = ReturnType<typeof FieldItem>;
export default FieldItem;
