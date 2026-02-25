/**
 * 坐标转换工具函数
 */

/**
 * 将屏幕坐标转换为 flow 坐标
 */
export function screenToFlowCoords(
	clientX: number,
	clientY: number
): { x: number; y: number } | null {
	const flowElement = document.querySelector('.svelte-flow') as HTMLElement;
	if (!flowElement) return null;

	const rect = flowElement.getBoundingClientRect();
	const viewportElement = flowElement.querySelector('.svelte-flow__viewport') as HTMLElement;
	if (!viewportElement) return null;

	const transform = viewportElement.style.transform;
	const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)\s*scale\(([\d.]+)\)/);
	if (!match) return null;

	const viewportX = parseFloat(match[1]);
	const viewportY = parseFloat(match[2]);
	const zoom = parseFloat(match[3]);

	const x = (clientX - rect.left - viewportX) / zoom;
	const y = (clientY - rect.top - viewportY) / zoom;

	return { x, y };
}

/**
 * 将 flow 坐标转换为屏幕坐标
 */
export function flowToScreenCoords(
	flowX: number,
	flowY: number
): { x: number; y: number } | null {
	const flowElement = document.querySelector('.svelte-flow') as HTMLElement;
	if (!flowElement) return null;

	const rect = flowElement.getBoundingClientRect();
	const viewportElement = flowElement.querySelector('.svelte-flow__viewport') as HTMLElement;
	if (!viewportElement) return null;

	const transform = viewportElement.style.transform;
	const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)\s*scale\(([\d.]+)\)/);
	if (!match) return null;

	const viewportX = parseFloat(match[1]);
	const viewportY = parseFloat(match[2]);
	const zoom = parseFloat(match[3]);

	const x = flowX * zoom + viewportX + rect.left;
	const y = flowY * zoom + viewportY + rect.top;

	return { x, y };
}
