import { it, expect, vi } from "vitest";

import * as adapter from "./__fixtures__/adapter";
import { createSliceMachineProject } from "./__testutils__/createSliceMachineProject";

import { createSliceMachineHookSystem } from "../src/createSliceMachineHookSystem";
import { createSliceMachineActions } from "../src/createSliceMachineActions";

const project = createSliceMachineProject(adapter.valid);
const hookSystem = createSliceMachineHookSystem();
const args = {
	libraryID: "foo",
	sliceID: "bar",
};

it("returns slice model", async () => {
	const spy = vi.spyOn(hookSystem, "callHook").mockImplementation(
		vi.fn().mockResolvedValue({
			data: ["baz"],
			errors: [],
		}),
	);

	const { readSliceModel } = createSliceMachineActions(project, hookSystem);

	expect(await readSliceModel(args)).toBe("baz");
	expect(spy).toHaveBeenCalledWith("slice:read", args);

	vi.resetAllMocks();
});

it("throws when no slice model is returned", async () => {
	const spy = vi.spyOn(hookSystem, "callHook").mockImplementation(
		vi.fn().mockResolvedValue({
			data: [],
			errors: [],
		}),
	);
	const { readSliceModel } = createSliceMachineActions(project, hookSystem);

	await expect(() => readSliceModel(args)).rejects.toThrowError(
		"Slice `bar` not found in the `foo` library.",
	);
	expect(spy).toHaveBeenCalledWith("slice:read", args);

	vi.resetAllMocks();
});
