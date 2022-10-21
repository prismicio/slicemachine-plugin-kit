/* eslint @typescript-eslint/no-explicit-any: "off", @typescript-eslint/no-non-null-assertion: "off" */
import * as fs from "node:fs/promises";
import { Bench, Task } from "tinybench";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
	SliceMachineProject,
	createSliceMachinePluginRunner,
	defineSliceMachinePlugin,
} from "@slicemachine/plugin-kit";

const resultsPrinter = (task: Task) => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const result = task.result!;

	// eslint-disable-next-line no-console
	console.log(`${task.name} x ${Math.floor(result.hz)} ops/s`);
};

export const runBench = async (bench: Bench): Promise<void> => {
	await bench.warmup();
	await bench.run();

	bench.tasks.forEach(resultsPrinter);

	const sorted = bench.tasks.sort((a, b) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return b.result!.hz - a.result!.hz;
	});

	const fastest = sorted[0];
	const nextFastest = sorted[1];

	const delta =
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		Math.round((fastest.result!.hz / nextFastest.result!.hz - 1) * 100 * 100) /
		100;

	// eslint-disable-next-line no-console
	console.log(
		`Fastest is ${sorted[0].name} (${delta}% faster than runner-up)\n`,
	);
};

const wait = async (ms = 0): Promise<void> => {
	await new Promise((res) => setTimeout(res, ms));
};

const adapter = defineSliceMachinePlugin({
	meta: {
		name: "benchmark-adapter",
	},
	setup: ({ hook }) => {
		hook("slice-library:read", async ({ libraryID }, { helpers }) => {
			const fileNames = await fs.readdir(helpers.joinPathFromRoot(libraryID));
			const sliceIDs = fileNames.map((fileName) => {
				return path.basename(fileName);
			});

			return { id: libraryID, sliceIDs };
		});

		hook("slice:read", async ({ libraryID, sliceID }, { helpers }) => {
			const filePath = helpers.joinPathFromRoot(libraryID, `${sliceID}.json`);
			const contents = await fs.readFile(filePath, "utf8");

			return { model: JSON.parse(contents) };
		});
		hook("slice:create", async () => {
			await wait();
		});
		hook("slice:update", async () => {
			await wait();
		});
		hook("slice:delete", async () => {
			await wait();
		});

		hook("custom-type-library:read", async (_, { helpers }) => {
			const fileNames = await fs.readdir(
				helpers.joinPathFromRoot("customTypes"),
			);
			const ids = fileNames.map((fileName) => {
				return path.basename(fileName);
			});

			return { ids };
		});

		hook("custom-type:read", async ({ id }, { helpers }) => {
			const filePath = helpers.joinPathFromRoot("customTypes", `${id}.json`);
			const contents = await fs.readFile(filePath, "utf8");

			return { model: JSON.parse(contents) };
		});
		hook("custom-type:create", async () => {
			await wait();
		});
		hook("custom-type:update", async () => {
			await wait();
		});
		hook("custom-type:delete", async () => {
			await wait();
		});

		hook("slice-simulator:setup:read", () => {
			return [];
		});
	},
});

const project: SliceMachineProject = {
	root: path.dirname(fileURLToPath(import.meta.url)),
	config: {
		_latest: "latest",
		adapter,
		libraries: ["./slices"],
		apiEndpoint: "https://example.com",
	},
};
const libraryID = project.config.libraries![0];

const pluginRunners = {
	noPlugins: createSliceMachinePluginRunner({
		project,
	}),
	manyPlugins: createSliceMachinePluginRunner({
		project: {
			...project,
			config: {
				...project.config,
				plugins: Array(1000).fill(adapter),
			},
		},
	}),
};

await Promise.all([
	pluginRunners.noPlugins.init(),
	pluginRunners.manyPlugins.init(),
]);

{
	const bench = new Bench();
	bench.add("noPlugins#readAllCustomTypeModels", async () => {
		await pluginRunners.noPlugins.rawActions.readAllCustomTypeModels();
	});
	bench.add("manyPlugins#readAllCustomTypeModels", async () => {
		await pluginRunners.manyPlugins.rawActions.readAllCustomTypeModels();
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#readAllSliceModels", async () => {
		await pluginRunners.noPlugins.rawActions.readAllSliceModels();
	});
	bench.add("manyPlugins#readAllSliceModels", async () => {
		await pluginRunners.manyPlugins.rawActions.readAllSliceModels();
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#readAllSliceModelsForLibrary", async () => {
		await pluginRunners.noPlugins.rawActions.readAllSliceModelsForLibrary({
			libraryID,
		});
	});
	bench.add("manyPlugins#readAllSliceModelsForLibrary", async () => {
		await pluginRunners.manyPlugins.rawActions.readAllSliceModelsForLibrary({
			libraryID,
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#slice-library:read", async () => {
		await pluginRunners.noPlugins.callHook("slice-library:read", {
			libraryID,
		});
	});
	bench.add("manyPlugins#slice-library:read", async () => {
		await pluginRunners.manyPlugins.callHook("slice-library:read", {
			libraryID,
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#slice:create", async () => {
		await pluginRunners.noPlugins.callHook("slice:create", {
			libraryID,
			model: {} as any,
		});
	});
	bench.add("manyPlugins#slice:create", async () => {
		await pluginRunners.manyPlugins.callHook("slice:create", {
			libraryID,
			model: {} as any,
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#slice:read", async () => {
		await pluginRunners.noPlugins.callHook("slice:read", {
			libraryID,
			sliceID: "foo",
		});
	});
	bench.add("manyPlugins#slice:read", async () => {
		await pluginRunners.manyPlugins.callHook("slice:read", {
			libraryID,
			sliceID: "foo",
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#slice:update", async () => {
		await pluginRunners.noPlugins.callHook("slice:update", {
			libraryID,
			model: {} as any,
		});
	});
	bench.add("manyPlugins#slice:update", async () => {
		await pluginRunners.manyPlugins.callHook("slice:update", {
			libraryID,
			model: {} as any,
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#slice:delete", async () => {
		await pluginRunners.noPlugins.callHook("slice:delete", {
			libraryID,
			model: {} as any,
		});
	});
	bench.add("manyPlugins#slice:delete", async () => {
		await pluginRunners.manyPlugins.callHook("slice:delete", {
			libraryID,
			model: {} as any,
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#custom-type-library:read", async () => {
		await pluginRunners.noPlugins.callHook(
			"custom-type-library:read",
			undefined,
		);
	});
	bench.add("manyPlugins#custom-type-library:read", async () => {
		await pluginRunners.manyPlugins.callHook(
			"custom-type-library:read",
			undefined,
		);
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#custom-type:create", async () => {
		await pluginRunners.noPlugins.callHook("custom-type:create", {
			model: {} as any,
		});
	});
	bench.add("manyPlugins#custom-type:create", async () => {
		await pluginRunners.manyPlugins.callHook("custom-type:create", {
			model: {} as any,
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#custom-type:read", async () => {
		await pluginRunners.noPlugins.callHook("custom-type:read", {
			id: "foo",
		});
	});
	bench.add("manyPlugins#custom-type:read", async () => {
		await pluginRunners.manyPlugins.callHook("custom-type:read", {
			id: "foo",
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#custom-type:update", async () => {
		await pluginRunners.noPlugins.callHook("custom-type:update", {
			model: {} as any,
		});
	});
	bench.add("manyPlugins#custom-type:update", async () => {
		await pluginRunners.manyPlugins.callHook("custom-type:update", {
			model: {} as any,
		});
	});
	await runBench(bench);
}

{
	const bench = new Bench();
	bench.add("noPlugins#custom-type:delete", async () => {
		await pluginRunners.noPlugins.callHook("custom-type:delete", {
			model: {} as any,
		});
	});
	bench.add("manyPlugins#custom-type:delete", async () => {
		await pluginRunners.manyPlugins.callHook("custom-type:delete", {
			model: {} as any,
		});
	});
	await runBench(bench);
}
