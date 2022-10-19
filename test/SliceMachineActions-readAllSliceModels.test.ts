import { it, expect } from "vitest";

import { createSliceMachineProject } from "./__testutils__/createSliceMachineProject";
import { createTestAdapter } from "./__testutils__/createTestAdapter";

import { createSliceMachinePluginRunner, SliceMachineActions } from "../src";

it("returns all slice models from all libraries", async (ctx) => {
	const library1Models = [
		ctx.mock.model.sharedSlice(),
		ctx.mock.model.sharedSlice(),
	];
	const library2Models = [
		ctx.mock.model.sharedSlice(),
		ctx.mock.model.sharedSlice(),
	];
	const libraries = [
		{
			id: "lib-1",
			sliceIDs: library1Models.map((model) => model.id),
			__models: library1Models,
		},
		{
			id: "lib-2",
			sliceIDs: library2Models.map((model) => model.id),
			__models: library2Models,
		},
	];

	let actions!: SliceMachineActions;

	const adapter = createTestAdapter({
		setup: ({ hook }) => {
			hook("__debug__", async (_, context) => {
				actions = context.actions;
			});
			hook("slice-library:read", async (args) => {
				const library = libraries.find((library) => {
					return library.id === args.libraryID;
				});

				if (library) {
					return library;
				}

				throw new Error("not implemented");
			});
			hook("slice:read", async (args) => {
				const library = libraries.find(
					(library) => library.id === args.libraryID,
				);
				const model = library?.__models.find(
					(model) => model.id === args.sliceID,
				);

				if (model) {
					return { model };
				}

				throw new Error("not implemented");
			});
		},
	});
	const project = createSliceMachineProject(adapter);
	project.config.libraries = libraries.map((library) => library.id);

	const pluginRunner = createSliceMachinePluginRunner({ project });
	await pluginRunner.init();
	await pluginRunner.callHook("__debug__", undefined);

	const res = await actions.readAllSliceModels();
	expect(res).toStrictEqual(
		libraries.flatMap((library) =>
			library.__models.map((model) => {
				return {
					libraryID: library.id,
					model,
				};
			}),
		),
	);
});

it("returns empty array when project has no Slice Libraries", async () => {
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

	const res = await actions.readAllSliceModels();
	expect(res).toStrictEqual([]);
});
