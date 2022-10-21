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
	SliceCreateHookReturnType,
	//
	// -- slice:update
	SliceUpdateHook,
	SliceUpdateHookData,
	SliceUpdateHookReturnType,
	//
	// -- slice:delete
	SliceDeleteHook,
	SliceDeleteHookData,
	SliceDeleteHookReturnType,
	//
	// -- slice:read
	SliceReadHook,
	SliceReadHookData,
	SliceReadHookReturnType,
	//
	// -- slice:asset:update
	SliceAssetUpdateHook,
	SliceAssetUpdateHookData,
	SliceAssetUpdateHookReturnType,
	//
	// -- slice:asset:delete
	SliceAssetDeleteHook,
	SliceAssetDeleteHookData,
	SliceAssetDeleteHookReturnType,
	//
	// -- slice:asset:read
	SliceAssetReadHook,
	SliceAssetReadHookData,
	SliceAssetReadHookReturnType,
	//
	// -- slice-library:read
	SliceLibraryReadHook,
	SliceLibraryReadHookData,
	SliceLibraryReadHookReturnType,
	//
	// -- customType:create
	CustomTypeCreateHook,
	CustomTypeCreateHookData,
	CustomTypeCreateHookReturnType,
	//
	// -- customType:update
	CustomTypeUpdateHook,
	CustomTypeUpdateHookData,
	CustomTypeUpdateHookReturnType,
	//
	// -- customType:delete
	CustomTypeDeleteHook,
	CustomTypeDeleteHookData,
	CustomTypeDeleteHookReturnType,
	//
	// -- customType:read
	CustomTypeReadHook,
	CustomTypeReadHookData,
	CustomTypeReadHookReturnType,
	//
	// -- custom-type:asset:update
	CustomTypeAssetUpdateHook,
	CustomTypeAssetUpdateHookData,
	CustomTypeAssetUpdateHookReturnType,
	//
	// -- custom-type:asset:delete
	CustomTypeAssetDeleteHook,
	CustomTypeAssetDeleteHookData,
	CustomTypeAssetDeleteHookReturnType,
	//
	// -- custom-type:asset:read
	CustomTypeAssetReadHook,
	CustomTypeAssetReadHookData,
	CustomTypeAssetReadHookReturnType,
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
