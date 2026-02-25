/**
 * 生成 UUID v4
 */
export function uuid(): string {
	return crypto.randomUUID();
}

/**
 * 生成短 ID（用于显示）
 */
export function shortId(length = 8): string {
	return crypto.randomUUID().replace(/-/g, '').slice(0, length);
}
