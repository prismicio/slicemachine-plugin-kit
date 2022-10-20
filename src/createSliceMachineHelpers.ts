import * as path from "node:path";
import * as fs from "node:fs/promises";

import prettier from "prettier";
import stripIndent from "strip-indent";

import { SliceMachineProject } from "./types";

type FormatOptions = {
	prettier?: prettier.Options;
};

/**
 * Creates Slice Machine helpers.
 *
 * @internal
 */
export const createSliceMachineHelpers = (
	project: SliceMachineProject,
): SliceMachineHelpers => {
	return new SliceMachineHelpers(project);
};

/**
 * Slice Machine helpers shared to plugins and hooks.
 */
export class SliceMachineHelpers {
	project: SliceMachineProject;

	constructor(project: SliceMachineProject) {
		this.project = project;
	}

	getProject = async (): Promise<SliceMachineProject> => {
		const configFilePath = this.joinPathFromRoot("sm.json");
		const configContents = await fs.readFile(configFilePath, "utf8");
		const config = JSON.parse(configContents);

		return {
			...this.project,
			config,
		};
	};

	format = async (
		source: string,
		filePath?: string,
		options?: FormatOptions,
	): Promise<string> => {
		let formatted = stripIndent(source);

		const prettierOptions = await prettier.resolveConfig(
			filePath || this.project.root,
		);

		formatted = prettier.format(formatted, {
			...prettierOptions,
			filepath: filePath,
			...(options?.prettier ?? {}),
		});

		return formatted;
	};

	joinPathFromRoot = (...paths: string[]): string => {
		return path.join(this.project.root, ...paths);
	};
}
