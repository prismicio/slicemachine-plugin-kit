// Public (for plugin authors)

export { defineSliceMachinePlugin } from "./defineSliceMachinePlugin";
export type { SliceMachinePlugin } from "./defineSliceMachinePlugin";

export type {
	SliceMachineActions,
	ReadAllSliceModelsActionArgs,
	ReadAllSliceModelsActionReturnType,
	ReadAllSliceModelsForLibraryActionArgs,
} from "./createSliceMachineActions";
export type { SliceMachineHelpers } from "./createSliceMachineHelpers";
export type { SliceMachineContext } from "./createSliceMachineContext";

export {
	SliceMachineHookType,
	SnippetReadHookDataRootModelType,
	SliceSimulatorSetupStepValidationMessageType,
} from "./types";

export type {
	PluginOptions,
	SliceMachineProject,
	SliceMachineConfig,
	SliceLibrary,
	// Public hooks
	//
	// -- types
	SliceMachineHooks,
	SliceMachineHookTypes,
	//
	// -- slice:create
	SliceCreateHook,
	SliceCreateHookData,
	//
	// -- slice:update
	SliceUpdateHook,
	SliceUpdateHookData,
	//
	// -- slice:delete
	SliceDeleteHook,
	SliceDeleteHookData,
	//
	// -- slice:read
	SliceReadHook,
	SliceReadHookData,
	SliceReadHookReturnType,
	//
	// -- slice-library:read
	SliceLibraryReadHook,
	SliceLibraryReadHookData,
	SliceLibraryReadHookReturnType,
	//
	// -- customType:create
	CustomTypeCreateHook,
	CustomTypeCreateHookData,
	//
	// -- customType:update
	CustomTypeUpdateHook,
	CustomTypeUpdateHookData,
	//
	// -- customType:delete
	CustomTypeDeleteHook,
	CustomTypeDeleteHookData,
	//
	// -- customType:read
	CustomTypeReadHook,
	CustomTypeReadHookData,
	CustomTypeReadHookReturnType,
	//
	// -- custom-type-library:read
	CustomTypeLibraryReadHook,
	CustomTypeLibraryReadHookReturnType,
	//
	// -- snippet:read
	SnippetReadHook,
	SnippetReadHookData,
	SnippetReadHookReturnType,
	SnippetDescriptor,
	//
	// -- slice-simulator:setup:read
	SliceSimulatorSetupReadHook,
	SliceSimulatorSetupReadHookReturnType,
	SliceSimulatorSetupStep,
	SliceSimulatorSetupStepValidationMessage,
} from "./types";

export { HookError } from "./lib";

// Internal (for Slice Machine)

export { createSliceMachinePluginRunner } from "./createSliceMachinePluginRunner";
export type { SliceMachinePluginRunner } from "./createSliceMachinePluginRunner";

export type { CallHookReturnType } from "./lib";
