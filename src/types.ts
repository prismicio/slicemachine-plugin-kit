import * as prismicT from "@prismicio/types";

import { SliceMachineContext } from "./createSliceMachineContext";
import { SliceMachinePlugin } from "./defineSliceMachinePlugin";
import { Hook } from "./lib";

type Promisable<T> = T | PromiseLike<T>;

export type PluginOptions = Record<string, unknown>;

/**
 * How plugins are registered.
 */
export type SliceMachineConfigPluginRegistration<
	TPluginOptions extends PluginOptions = PluginOptions,
> =
	| string
	| SliceMachinePlugin
	| {
			resolve: string | SliceMachinePlugin;
			options?: TPluginOptions;
	  };

/**
 * Slice Machine `sm.json` config.
 */
export type SliceMachineConfig = {
	_latest: string;
	apiEndpoint: string;
	localSliceSimulatorURL?: string;
	libraries?: string[];
	adapter: SliceMachineConfigPluginRegistration;
	plugins?: SliceMachineConfigPluginRegistration[];
};

export type SliceMachineProject = {
	/**
	 * An absolute path to project root.
	 */
	root: string;
	/**
	 * Slice Machine `sm.json` content, validated.
	 */
	config: SliceMachineConfig;
};

export type SliceLibrary = {
	id: string;
};

// ============================================================================
//
// # HOOK TYPES
//
// ============================================================================

export type SliceMachineHook<TData, TReturn> = (
	data: TData,
) => Promisable<TReturn>;

export type SliceMachineHookExtraArgs<
	TPluginOptions extends PluginOptions = PluginOptions,
> = [context: SliceMachineContext<TPluginOptions>];

export type ExtendSliceMachineHook<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	THook extends SliceMachineHook<any, any>,
	TPluginOptions extends PluginOptions = PluginOptions,
> = (
	...args: [
		...args: Parameters<THook>,
		...extraArgs: SliceMachineHookExtraArgs<TPluginOptions>,
	]
) => ReturnType<THook>;

export const SliceMachineHookType = {
	__debug__: "__debug__",
	slice_create: "slice:create",
	slice_update: "slice:update",
	slice_delete: "slice:delete",
	slice_read: "slice:read",
	sliceLibrary_read: "slice-library:read",
	customType_create: "custom-type:create",
	customType_update: "custom-type:update",
	customType_delete: "custom-type:delete",
	customType_read: "custom-type:read",
	customTypeLibrary_read: "custom-type-library:read",
	snippet_read: "snippet:read",
	sliceSimulator_setup_read: "slice-simulator:setup:read",
} as const;

export type SliceMachineHookTypes =
	typeof SliceMachineHookType[keyof typeof SliceMachineHookType];

export type SliceMachineHooks = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[SliceMachineHookType.__debug__]: Hook<SliceMachineHook<any, any>>;

	// Slices
	[SliceMachineHookType.slice_create]: Hook<SliceCreateHookBase>;
	[SliceMachineHookType.slice_update]: Hook<SliceUpdateHookBase>;
	[SliceMachineHookType.slice_delete]: Hook<SliceDeleteHookBase>;
	[SliceMachineHookType.slice_read]: Hook<SliceReadHookBase>;

	// Slice Libraries
	[SliceMachineHookType.sliceLibrary_read]: Hook<SliceLibraryReadHookBase>;

	// Custom Types
	[SliceMachineHookType.customType_create]: Hook<CustomTypeCreateHookBase>;
	[SliceMachineHookType.customType_update]: Hook<CustomTypeUpdateHookBase>;
	[SliceMachineHookType.customType_delete]: Hook<CustomTypeDeleteHookBase>;
	[SliceMachineHookType.customType_read]: Hook<CustomTypeReadHookBase>;

	// Custom Type Libraries
	[SliceMachineHookType.customTypeLibrary_read]: Hook<CustomTypeLibraryReadHookBase>;

	// Snippets
	[SliceMachineHookType.snippet_read]: Hook<SnippetReadHookBase>;

	// Slice Simulator
	[SliceMachineHookType.sliceSimulator_setup_read]: Hook<SliceSimulatorSetupReadHookBase>;
};

// ============================================================================
// ## slice:create
// ============================================================================

export type SliceCreateHookData = {
	libraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceCreateHookBase = SliceMachineHook<SliceCreateHookData, void>;
export type SliceCreateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceCreateHookBase, TPluginOptions>;

// ============================================================================
// ## slice:update
// ============================================================================

export type SliceUpdateHookData = {
	libraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceUpdateHookBase = SliceMachineHook<SliceUpdateHookData, void>;
export type SliceUpdateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceUpdateHookBase, TPluginOptions>;

// ============================================================================
// ## slice:delete
// ============================================================================

export type SliceDeleteHookData = {
	libraryID: string;
	model: prismicT.SharedSliceModel;
};
export type SliceDeleteHookBase = SliceMachineHook<SliceDeleteHookData, void>;
export type SliceDeleteHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceDeleteHookBase, TPluginOptions>;

// ============================================================================
// ## slice:read
// ============================================================================

export type SliceReadHookData = {
	libraryID: string;
	sliceID: string;
};
export type SliceReadHookReturnType = { model: prismicT.SharedSliceModel };
export type SliceReadHookBase = SliceMachineHook<
	SliceReadHookData,
	SliceReadHookReturnType
>;
export type SliceReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceReadHookBase, TPluginOptions>;

// ============================================================================
// ## slice-library:read
// ============================================================================

export type SliceLibraryReadHookData = {
	libraryID: string;
};
export type SliceLibraryReadHookReturnType = SliceLibrary & {
	sliceIDs: string[];
};
export type SliceLibraryReadHookBase = SliceMachineHook<
	SliceLibraryReadHookData,
	SliceLibraryReadHookReturnType
>;
export type SliceLibraryReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceLibraryReadHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type:create
// ============================================================================

export type CustomTypeCreateHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeCreateHookBase = SliceMachineHook<
	CustomTypeCreateHookData,
	void
>;
export type CustomTypeCreateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeCreateHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type:update
// ============================================================================

export type CustomTypeUpdateHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeUpdateHookBase = SliceMachineHook<
	CustomTypeUpdateHookData,
	void
>;
export type CustomTypeUpdateHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeUpdateHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type:delete
// ============================================================================

export type CustomTypeDeleteHookData = {
	model: prismicT.CustomTypeModel;
};
export type CustomTypeDeleteHookBase = SliceMachineHook<
	CustomTypeDeleteHookData,
	void
>;
export type CustomTypeDeleteHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeDeleteHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type:read
// ============================================================================

export type CustomTypeReadHookData = {
	id: string;
};
export type CustomTypeReadHookReturnType = { model: prismicT.CustomTypeModel };
export type CustomTypeReadHookBase = SliceMachineHook<
	CustomTypeReadHookData,
	CustomTypeReadHookReturnType
>;
export type CustomTypeReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeReadHookBase, TPluginOptions>;

// ============================================================================
// ## custom-type-library:read
// ============================================================================

export type CustomTypeLibraryReadHookReturnType = {
	ids: string[];
};
export type CustomTypeLibraryReadHookBase = SliceMachineHook<
	undefined,
	CustomTypeLibraryReadHookReturnType
>;
export type CustomTypeLibraryReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<CustomTypeLibraryReadHookBase, TPluginOptions>;

// ============================================================================
// ## snippet:read
// ============================================================================

export const SnippetReadHookDataRootModelType = {
	Slice: "Slice",
	CustomType: "CustomType",
} as const;
export type SnippetReadHookData = {
	fieldPath: string[];
} & (
	| {
			rootModelType: typeof SnippetReadHookDataRootModelType.Slice;
			rootModel: prismicT.SharedSliceModel;
			model: prismicT.CustomTypeModelFieldForGroup;
	  }
	| {
			rootModelType: typeof SnippetReadHookDataRootModelType.CustomType;
			rootModel: prismicT.CustomTypeModel;
			model: prismicT.CustomTypeModelField;
	  }
);
export type SnippetDescriptor = {
	label: string;
	language: string;
	code: string;
};
export type SnippetReadHookReturnType =
	| SnippetDescriptor
	| SnippetDescriptor[]
	| undefined;
export type SnippetReadHookBase = SliceMachineHook<
	SnippetReadHookData,
	SnippetReadHookReturnType
>;
export type SnippetReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SnippetReadHookBase, TPluginOptions>;

// ============================================================================
// ## slice-simulator:setup:read
// ============================================================================

export const SliceSimulatorSetupStepValidationMessageType = {
	Error: "Error",
	Warning: "Warning",
} as const;
export type SliceSimulatorSetupStepValidationMessage = {
	type: typeof SliceSimulatorSetupStepValidationMessageType[keyof typeof SliceSimulatorSetupStepValidationMessageType];
	title: string;
	message: string;
};
export type SliceSimulatorSetupStep = {
	title: string;
	body: string;
	validate?: () => Promisable<
		| SliceSimulatorSetupStepValidationMessage
		| SliceSimulatorSetupStepValidationMessage[]
		| void
	>;
};
export type SliceSimulatorSetupReadHookReturnType = SliceSimulatorSetupStep[];
export type SliceSimulatorSetupReadHookBase = SliceMachineHook<
	undefined,
	SliceSimulatorSetupReadHookReturnType
>;
export type SliceSimulatorSetupReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceSimulatorSetupReadHookBase, TPluginOptions>;
