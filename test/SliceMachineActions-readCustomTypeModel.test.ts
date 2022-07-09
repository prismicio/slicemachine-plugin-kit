import { it, expect, vi } from "vitest";

import * as adapter from "./__fixtures__/adapter";
import { createSliceMachineProject } from "./__testutils__/createSliceMachineProject";

import { createSliceMachineHookSystem } from "../src/createSliceMachineHookSystem";
import { createSliceMachineActions } from "../src/createSliceMachineActions";

const project = createSliceMachineProject(adapter.valid);
const hookSystem = createSliceMachineHookSystem();
const args = {
	id: "foo",
};

it("returns slice model", async () => {
	const spy = vi.spyOn(hookSystem, "callHook").mockImplementation(
		vi.fn().mockResolvedValue({
			data: ["baz"],
			errors: [],
		}),
	);

	const { readCustomTypeModel } = createSliceMachineActions(
		project,
		hookSystem,
	);

	expect(await readCustomTypeModel(args)).toBe("baz");
	expect(spy).toHaveBeenCalledWith("custom-type:read", args);

	vi.resetAllMocks();
});

it("throws when no slice model is returned", async () => {
	const spy = vi.spyOn(hookSystem, "callHook").mockImplementation(
		vi.fn().mockResolvedValue({
			data: [],
			errors: [],
		}),
	);
	const { readCustomTypeModel } = createSliceMachineActions(
		project,
		hookSystem,
	);

	await expect(
		readCustomTypeModel(args),
	).rejects.toThrowErrorMatchingInlineSnapshot(
		'"Custom Type `foo` not found."',
	);
	expect(spy).toHaveBeenCalledWith("custom-type:read", args);

	vi.resetAllMocks();
});
