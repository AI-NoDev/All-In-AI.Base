/**
 * 开发模式 Actions
 */

import { getProjectRoot,readFileContent,readDirectory } from './projectCode.ts';

export * from './projectCode';

export const devActions = [
	getProjectRoot,readFileContent,readDirectory
]
