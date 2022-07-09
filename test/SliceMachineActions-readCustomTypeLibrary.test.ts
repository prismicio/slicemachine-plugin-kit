import { it, expect, vi } from "vitest";

import * as adapter from "./__fixtures__/adapter";
import { createSliceMachineProject } from "./__testutils__/createSliceMachineProject";

import { createSliceMachineHookSystem } from "../src/createSliceMachineHookSystem";
import { createSliceMachineActions } from "../src/createSliceMachineActions";

const project = createSliceMachineProject(adapter.valid);
const hookSystem = createSliceMachineHookSystem();

it("returns slice model", async () => {
	const spy = vi.spyOn(hookSystem, "callHook").mockImplementation(
		vi.fn().mockResolvedValue({
			data: ["baz"],
			errors: [],
		}),
	);

	const { readCustomTypeLibrary } = createSliceMachineActions(
		project,
		hookSystem,
	);

	expect(await readCustomTypeLibrary({})).toBe("baz");
	expect(spy).toHaveBeenCalledWith("custom-type-library:read", {});

	vi.resetAllMocks();
});

it("throws when no slice model is returned", async () => {
	const spy = vi.spyOn(hookSystem, "callHook").mockImplementation(
		vi.fn().mockResolvedValue({
			data: [],
			errors: [],
		}),
	);
	const { readCustomTypeLibrary } = createSliceMachineActions(
		project,
		hookSystem,
	);

	await expect(() => readCustomTypeLibrary({})).rejects.toThrowError(
		"Couldn't read Custom Type library.",
	);
	expect(spy).toHaveBeenCalledWith("custom-type-library:read", {});

	vi.resetAllMocks();
});
