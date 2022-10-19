import { SliceMachinePlugin, SliceMachineProject } from "../../src";

import { createTestAdapter } from "./createTestAdapter";

export const createSliceMachineProject = (
	adapter: string | SliceMachinePlugin = createTestAdapter(),
	plugins?: (string | SliceMachinePlugin)[],
): SliceMachineProject => {
	return {
		root: "/tmp/slicemachine-test",
		config: {
			_latest: "0.0.0",
			apiEndpoint: "https://qwerty.cdn.prismic.io/api/v2",
			adapter,
			plugins,
		},
	};
};
