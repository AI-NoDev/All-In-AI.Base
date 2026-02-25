/**
 * Shared Lexical utilities and constants for NoteNode components
 */
import {
	TEXT_FORMAT_TRANSFORMERS,
	UNORDERED_LIST,
	ORDERED_LIST,
	LINK
} from 'svelte-lexical';

/**
 * Markdown transformers for NoteNode
 * Only includes: text formatting, lists, and links
 * Excludes: heading, quote, code block, table
 */
export const NOTE_TRANSFORMERS = [
	...TEXT_FORMAT_TRANSFORMERS,
	UNORDERED_LIST,
	ORDERED_LIST,
	LINK
];

/**
 * RangeSelection interface for duck typing
 */
export interface RangeSelection {
	anchor: { getNode: () => LexicalNode };
	focus: { getNode: () => LexicalNode };
	getNodes: () => LexicalNode[];
	getTextContent: () => string;
	formatText: (format: string) => void;
	insertNodes: (nodes: LexicalNode[]) => void;
	hasFormat?: (format: string) => boolean;
}

/**
 * LexicalNode interface for duck typing
 */
export interface LexicalNode {
	getParent: () => LexicalNode | null;
	insertBefore: (node: LexicalNode) => void;
	remove: () => void;
	getChildren?: () => LexicalNode[];
	getStyle?: () => string;
}

/**
 * AppendableNode interface for nodes that can have children
 */
export interface AppendableNode extends LexicalNode {
	append: (node: LexicalNode) => void;
}

/**
 * Check if selection is a RangeSelection using duck typing
 */
export function isRangeSelection(selection: unknown): selection is RangeSelection {
	return (
		selection !== null &&
		typeof selection === 'object' &&
		'anchor' in selection &&
		'focus' in selection &&
		'getNodes' in selection &&
		'formatText' in selection
	);
}
