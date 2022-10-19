import { it, expect } from "vitest";

import { createSliceMachineProject } from "./__testutils__/createSliceMachineProject";
import { createTestAdapter } from "./__testutils__/createTestAdapter";

import { createSliceMachinePluginRunner, SliceMachineActions } from "../src";

it("returns all slice models for a library", async () => {
	const libraryID = "libraryID";
	const sliceIDs = ["foo", "bar"];

	let actions!: SliceMachineActions;

	const adapter = createTestAdapter({
		setup: ({ hook }) => {
			hook("__debug__", async (_, context) => {
				actions = context.actions;
			});
			hook("slice-library:read", async (args) => {
				if (args.libraryID === libraryID) {
					return { id: libraryID, sliceIDs };
				}

				throw new Error("not implemented");
			});
			hook("slice:read", async (args) => {
				if (args.libraryID === libraryID) {
					return args.sliceID as any;
				}

				throw new Error("not implemented");
			});
		},
	});
	const project = createSliceMachineProject(adapter);
	project.config.libraries = [libraryID];

	const pluginRunner = createSliceMachinePluginRunner({ project });
	await pluginRunner.init();
	await pluginRunner.callHook("__debug__", undefined);

	const res = await actions.readAllSliceModelsForLibrary({ libraryID });
	expect(res).toStrictEqual(sliceIDs);
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
