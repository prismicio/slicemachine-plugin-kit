import * as path from "node:path";
import * as fs from "node:fs/promises";

import prettier from "prettier";
import stripIndent from "strip-indent";

import { SliceMachineProject } from "./types";

type FormatOptions = {
	prettier?: prettier.Options;
};

/**
 * Slice Machine actions shared to plugins and hooks.
 */
export type SliceMachineHelpers = {
	getProject(): Promise<SliceMachineProject>;
	format(
		source: string,
		filePath?: string,
		options?: FormatOptions,
	): Promise<string>;
	joinPathFromRoot(...paths: string[]): string;
};

/**
 * Creates Slice Machine helpers.
 *
 * @internal
 */
export const createSliceMachineHelpers = (
	project: SliceMachineProject,
): SliceMachineHelpers => {
	return {
		getProject: async () => {
			const configFilePath = path.join(project.root, "sm.json");
			const configContents = await fs.readFile(configFilePath, "utf8");
			const config = JSON.parse(configContents);

			return {
				...project,
				config,
			};
		},

		format: async (source, filePath, options) => {
			let formatted = stripIndent(source);

			const prettierOptions = await prettier.resolveConfig(
				filePath || project.root,
			);

			formatted = prettier.format(formatted, {
				...prettierOptions,
				filepath: filePath,
				...(options?.prettier ?? {}),
			});

			return formatted;
		},

		joinPathFromRoot: (...paths) => {
			return path.join(project.root, ...paths);
		},
	};
};
