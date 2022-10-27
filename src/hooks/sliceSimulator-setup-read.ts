import type {
	ExtendSliceMachineHook,
	PluginOptions,
	Promisable,
	SliceMachineHook,
} from "../types";

/**
 * The type of validation result for a Slice Simulator set up step.
 */
export const SliceSimulatorSetupStepValidationMessageType = {
	Error: "Error",
	Warning: "Warning",
} as const;

/**
 * An object representing validation for a Slice Simulator set up step.
 */
export type SliceSimulatorSetupStepValidationMessage = {
	type: typeof SliceSimulatorSetupStepValidationMessageType[keyof typeof SliceSimulatorSetupStepValidationMessageType];
	title: string;
	message: string;
};

/**
 * An object representing a step to set up Slice Simulator.
 */
export type SliceSimulatorSetupStep = {
	title: string;
	body: string;
	validate?: () => Promisable<
		| SliceSimulatorSetupStepValidationMessage
		| SliceSimulatorSetupStepValidationMessage[]
		| void
	>;
};

/**
 * Data provided to `slice-simulator:setup:read` hook handlers.
 */
export type SliceSimulatorSetupReadHookData = undefined;

/**
 * Return value for `slice-simulator:setup:read` hook handlers.
 */
export type SliceSimulatorSetupReadHookReturnType = SliceSimulatorSetupStep[];

/**
 * Base version of a `slice-simulator:setup:read` hook handler without plugin
 * runner context.
 *
 * @internal
 */
export type SliceSimulatorSetupReadHookBase = SliceMachineHook<
	undefined,
	SliceSimulatorSetupReadHookReturnType
>;

/**
 * Handler for the `slice-simulator:setup:read` hook. The hook is called when a
 * Slice Simulator set up steps are needed.
 *
 * This hook is **required** to be implemented by adapters.
 *
 * This hook will only be called in adapters.
 *
 * @typeParam TPluginOptions - User-provided options for the hook's plugin.
 */
export type SliceSimulatorSetupReadHook<
	TPluginOptions extends PluginOptions = PluginOptions,
> = ExtendSliceMachineHook<SliceSimulatorSetupReadHookBase, TPluginOptions>;
