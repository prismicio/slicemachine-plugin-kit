import { it, expect, vi } from "vitest";

import * as adapter from "./__fixtures__/adapter";
import { createSliceMachineProject } from "./__testutils__/createSliceMachineProject";

import { createSliceMachineHookSystem } from "../src/createSliceMachineHookSystem";
import { createSliceMachineActions } from "../src/createSliceMachineActions";

const project = createSliceMachineProject(adapter.valid);
const hookSystem = createSliceMachineHookSystem();
const args = {
	libraryID: "foo",
};

it("returns slice model", async () => {
	const spy = vi.spyOn(hookSystem, "callHook").mockImplementation(
		vi.fn().mockResolvedValue({
			data: ["baz"],
			errors: [],
		}),
	);

	const { readSliceLibrary } = createSliceMachineActions(project, hookSystem);

	expect(await readSliceLibrary(args)).toBe("baz");
	expect(spy).toHaveBeenCalledWith("slice-library:read", args);

	vi.resetAllMocks();
});

it("throws when no slice model is returned", async () => {
	const spy = vi.spyOn(hookSystem, "callHook").mockImplementation(
		vi.fn().mockResolvedValue({
			data: [],
			errors: [],
		}),
	);
	const { readSliceLibrary } = createSliceMachineActions(project, hookSystem);

	await expect(() => readSliceLibrary(args)).rejects.toThrowError(
		"Slice library `foo` not found.",
	);

	expect(spy).toHaveBeenCalledWith("slice-library:read", args);

	vi.resetAllMocks();
});
