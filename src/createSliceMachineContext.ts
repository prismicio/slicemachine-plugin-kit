import { HookSystem } from "./lib";
import {
	createSliceMachineActions,
	SliceMachineActions,
} from "./createSliceMachineActions";
import { LoadedSliceMachinePlugin } from "./defineSliceMachinePlugin";
import { SliceMachineHooks, SliceMachineProject } from "./types";
import {
	createSliceMachineHelpers,
	SliceMachineHelpers,
} from "./createSliceMachineHelpers";

/**
 * Slice Machine context shared to plugins and hooks.
 */
export type SliceMachineContext<
	TPluginOptions extends Record<string, unknown>,
> = {
	actions: SliceMachineActions;
	helpers: SliceMachineHelpers;
	project: SliceMachineProject;
	options: TPluginOptions;
};

/**
 * Creates Slice Machine context.
 *
 * @internal
 */
export const createSliceMachineContext = <
	TPluginOptions extends Record<string, unknown>,
>(
	project: SliceMachineProject,
	hookSystem: HookSystem<SliceMachineHooks>,
	plugin: LoadedSliceMachinePlugin<TPluginOptions>,
): SliceMachineContext<TPluginOptions> => {
	return {
		actions: createSliceMachineActions(project, hookSystem),
		helpers: createSliceMachineHelpers(project),
		project,
		options: plugin.options,
	};
};
