import { HookSystem } from "./lib";
import {
	SliceMachineProject,
	SliceMachineHooks,
	SliceReadHookBase,
	SliceLibraryReadHookBase,
	CustomTypeReadHookBase,
	CustomTypeLibraryReadHookBase,
} from "./types";

/**
 * Slice Machine actions shared to plugins and hooks.
 */
export type SliceMachineActions = {
	readSliceModel: SliceReadHookBase;
	readSliceLibrary: SliceLibraryReadHookBase;
	readCustomTypeModel: CustomTypeReadHookBase;
	readCustomTypeLibrary: CustomTypeLibraryReadHookBase;
};

/**
 * Creates Slice Machine actions.
 *
 * @internal
 */
export const createSliceMachineActions = (
	_project: SliceMachineProject,
	hookSystem: HookSystem<SliceMachineHooks>,
): SliceMachineActions => {
	return {
		readSliceModel: async (args) => {
			const {
				data: [model],
				errors: [cause],
			} = await hookSystem.callHook("slice:read", {
				libraryID: args.libraryID,
				sliceID: args.sliceID,
			});

			if (!model) {
				throw new Error(
					`Slice \`${args.sliceID}\` not found in the \`${args.libraryID}\` library.`,
					{ cause },
				);
			}

			return model;
		},

		readSliceLibrary: async (args) => {
			const {
				data: [library],
				errors: [cause],
			} = await hookSystem.callHook("slice-library:read", {
				libraryID: args.libraryID,
			});

			if (!library) {
				throw new Error(`Slice library \`${args.libraryID}\` not found.`, {
					cause,
				});
			}

			return library;
		},

		readCustomTypeModel: async (args) => {
			const {
				data: [model],
				errors: [cause],
			} = await hookSystem.callHook("custom-type:read", {
				id: args.id,
			});

			if (!model) {
				throw new Error(`Custom Type \`${args.id}\` not found.`, { cause });
			}

			return model;
		},

		readCustomTypeLibrary: async () => {
			const {
				data: [library],
				errors: [cause],
			} = await hookSystem.callHook("custom-type-library:read", {});

			if (!library) {
				throw new Error(`Couldn't read Custom Type library.`, {
					cause,
				});
			}

			return library;
		},
	};
};
