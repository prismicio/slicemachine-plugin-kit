import { it, expect } from "vitest";

import { createSliceMachineProject } from "./__testutils__/createSliceMachineProject";
import { createTestAdapter } from "./__testutils__/createTestAdapter";

import { createSliceMachinePluginRunner, SliceMachineActions } from "../src";

it("returns all slice models for a library", async (ctx) => {
	const models = [ctx.mock.model.sharedSlice(), ctx.mock.model.sharedSlice()];
	const library = {
		id: "lib",
		sliceIDs: models.map((model) => model.id),
	};

	let actions!: SliceMachineActions;

	const adapter = createTestAdapter({
		setup: ({ hook }) => {
			hook("__debug__", async (_, context) => {
				actions = context.actions;
			});
			hook("slice-library:read", async (args) => {
				if (args.libraryID === library.id) {
					return library;
				}

				throw new Error("not implemented");
			});
			hook("slice:read", async (args) => {
				if (args.libraryID === library.id) {
					const model = models.find((model) => model.id === args.sliceID);

					if (model) {
						return model;
					}
				}

				throw new Error("not implemented");
			});
		},
	});
	const project = createSliceMachineProject(adapter);
	project.config.libraries = [library.id];

	const pluginRunner = createSliceMachinePluginRunner({ project });
	await pluginRunner.init();
	await pluginRunner.callHook("__debug__", undefined);

	const res = await actions.readAllSliceModelsForLibrary({
		libraryID: library.id,
	});
	expect(res).toStrictEqual(models);
});

it("throws when Slice Library does not exist", async () => {
	let actions!: SliceMachineActions;

	const adapter = createTestAdapter({
		setup: ({ hook }) => {
			hook("__debug__", async (_, context) => {
				actions = context.actions;
			});
		},
	});
	const project = createSliceMachineProject(adapter);
	project.config.libraries = [];

	const pluginRunner = createSliceMachinePluginRunner({ project });
	await pluginRunner.init();
	await pluginRunner.callHook("__debug__", undefined);

	const fn = () => actions.readAllSliceModelsForLibrary({ libraryID: "foo" });
	expect(fn).rejects.toThrowError("Slice library `foo` not found.");
});
