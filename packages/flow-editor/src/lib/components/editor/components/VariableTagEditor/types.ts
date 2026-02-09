/**
 * Variable Tag Editor Types
 * 
 * Supports variable tags in format: {{#node.variable#}}
 * Example: {{#start.input_1#}}, {{#sys.user_id#}}
 */

/** Parsed segment of text content */
export interface TextSegment {
	type: 'text' | 'variable';
	content: string;
	/** Variable path (only for variable type) */
	path?: string;
}

/** Variable tag pattern: {{#xxx.xxx#}} */
export const VARIABLE_TAG_PATTERN = /\{\{#([^#]+)#\}\}/g;

/** Trigger characters for variable selector */
export const TRIGGER_CHARS = ['{', '/'] as const;

/**
 * Parse text content into segments
 */
export function parseContent(text: string): TextSegment[] {
	const segments: TextSegment[] = [];
	let lastIndex = 0;
	
	const regex = new RegExp(VARIABLE_TAG_PATTERN.source, 'g');
	let match: RegExpExecArray | null;
	
	while ((match = regex.exec(text)) !== null) {
		// Add text before the match
		if (match.index > lastIndex) {
			segments.push({
				type: 'text',
				content: text.slice(lastIndex, match.index)
			});
		}
		
		// Add variable tag
		segments.push({
			type: 'variable',
			content: match[0],
			path: match[1]
		});
		
		lastIndex = match.index + match[0].length;
	}
	
	// Add remaining text
	if (lastIndex < text.length) {
		segments.push({
			type: 'text',
			content: text.slice(lastIndex)
		});
	}
	
	return segments;
}

/**
 * Convert segments back to text
 */
export function segmentsToText(segments: TextSegment[]): string {
	return segments.map(s => s.content).join('');
}

/**
 * Create a variable tag string
 */
export function createVariableTag(path: string): string {
	return `{{#${path}#}}`;
}
