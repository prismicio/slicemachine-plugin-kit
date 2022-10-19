import { it, expect } from "vitest";

import { createSliceMachineProject } from "./__testutils__/createSliceMachineProject";
import { createTestAdapter } from "./__testutils__/createTestAdapter";

import { createSliceMachinePluginRunner, SliceMachineActions } from "../src";

it("returns all Custom Type models", async (ctx) => {
	const customTypeModels = [
		ctx.mock.model.customType(),
		ctx.mock.model.customType(),
	];

	let actions!: SliceMachineActions;

	const adapter = createTestAdapter({
		setup: ({ hook }) => {
			hook("__debug__", async (_, context) => {
				actions = context.actions;
			});
			hook("custom-type-library:read", async () => {
				return { ids: customTypeModels.map((model) => model.id) };
			});
			hook("custom-type:read", async (args) => {
				const model = customTypeModels.find(
					(customTypeModel) => customTypeModel.id === args.id,
				);

				if (model) {
					return model as any;
				}

				throw new Error("not implemented");
			});
		},
	});
	const project = createSliceMachineProject(adapter);

	const pluginRunner = createSliceMachinePluginRunner({ project });
	await pluginRunner.init();
	await pluginRunner.callHook("__debug__", undefined);

	const res = await actions.readAllCustomTypeModels();
	expect(res).toStrictEqual(customTypeModels);
});

it("returns empty array when project has no Custom Types", async () => {
	let actions!: SliceMachineActions;

	const adapter = createTestAdapter({
		setup: ({ hook }) => {
			hook("__debug__", async (_, context) => {
				actions = context.actions;
			});
			hook("custom-type-library:read", async () => {
				return { ids: [] };
			});
		},
	});
	const project = createSliceMachineProject(adapter);

	const pluginRunner = createSliceMachinePluginRunner({ project });
	await pluginRunner.init();
	await pluginRunner.callHook("__debug__", undefined);

	const res = await actions.readAllCustomTypeModels();
	expect(res).toStrictEqual([]);
});
