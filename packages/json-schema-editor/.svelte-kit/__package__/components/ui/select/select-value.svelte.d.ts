interface Props {
    ref?: HTMLSpanElement | null;
    class?: string;
    placeholder?: string;
    children?: import('svelte').Snippet;
}
declare const SelectValue: import("svelte").Component<Props, {}, "ref">;
type SelectValue = ReturnType<typeof SelectValue>;
export default SelectValue;
