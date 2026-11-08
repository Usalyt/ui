import { defineCommand } from "citty";
import pc from "picocolors";
import { printError } from "../lib/output";
import { loadRegistry, type Registry } from "../lib/registry";

export const listCommand = defineCommand({
  meta: {
    name: "list",
    description: "List the items in the packaged Usalyt registry",
  },
  args: {
    json: {
      type: "boolean",
      description: "Print machine-readable JSON",
    },
  },
  run({ args }) {
    let registry: Registry;
    try {
      ({ registry } = loadRegistry());
    } catch (error) {
      printError((error as Error).message);
      return;
    }

    if (args.json) {
      const payload = {
        name: registry.name,
        version: registry.version,
        count: registry.items.length,
        items: registry.items.map((item) => ({
          name: item.name,
          type: item.type,
          title: item.title,
          description: item.description,
          license: item.license,
          dependencies: item.dependencies,
          registryDependencies: item.registryDependencies,
        })),
      };
      process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
      return;
    }

    console.log(
      `${registry.name} registry ${registry.version}: ${registry.items.length} items`
    );
    for (const item of registry.items) {
      console.log(`  ${pc.bold(item.name)} (${item.type}) - ${item.description}`);
    }
    console.log("");
    console.log("Add components with: usalyt add <component>");
  },
});
