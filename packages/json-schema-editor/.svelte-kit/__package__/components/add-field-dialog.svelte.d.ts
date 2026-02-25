import { type Field } from '../types.js';
interface Props {
    open: boolean;
    field?: Field | null;
    locale?: 'zh' | 'en';
    existingNames?: string[];
    onSave: (field: Field) => void;
    onCancel: () => void;
}
declare const AddFieldDialog: import("svelte").Component<Props, {}, "open">;
type AddFieldDialog = ReturnType<typeof AddFieldDialog>;
export default AddFieldDialog;
