import { defineCommand } from "citty";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import pc from "picocolors";

export const initCommand = defineCommand({
  meta: {
    name: "init",
    description: "Initialize tu-ui in your project and create tu-ui.json configuration"
  },
  args: {
    yes: {
      type: "boolean",
      description: "Skip interactive prompts and use default configuration",
      alias: "y"
    }
  },
  async run({ args }) {
    p.intro(pc.bgCyan(pc.black(" tu-ui init ")));

    const cwd = process.cwd();
    const configPath = path.join(cwd, "tu-ui.json");

    let componentPath = "src/components/ui";
    let utilsPath = "src/lib/utils.ts";

    if (!args.yes) {
      const answers = await p.group(
        {
          componentPath: () =>
            p.text({
              message: "Where should UI components be installed?",
              placeholder: "src/components/ui",
              defaultValue: "src/components/ui"
            }),
          utilsPath: () =>
            p.text({
              message: "Where is your cn() utility located?",
              placeholder: "src/lib/utils.ts",
              defaultValue: "src/lib/utils.ts"
            })
        },
        {
          onCancel: () => {
            p.cancel("Operation cancelled.");
            process.exit(0);
          }
        }
      );
      componentPath = String(answers.componentPath);
      utilsPath = String(answers.utilsPath);
    }

    const config = {
      $schema: "https://tu-ui.dev/schema/config.json",
      style: "default",
      rsc: true,
      tsx: true,
      tailwind: {
        config: "",
        css: "src/styles/globals.css",
        baseColor: "neutral"
      },
      aliases: {
        components: `@/${componentPath}`,
        utils: `@/${utilsPath.replace(/\.ts$/, "")}`
      }
    };

    await fs.writeJson(configPath, config, { spaces: 2 });
    p.outro(pc.green(`✔ Created tu-ui.json configuration at ${configPath}`));
  }
});
