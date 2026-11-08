#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { addCommand } from "./commands/add";
import { initCommand } from "./commands/init";
import { listCommand } from "./commands/list";

const main = defineCommand({
  meta: {
    name: "usalyt",
    version: "0.0.1",
    description: "Usalyt component distribution CLI",
  },
  subCommands: {
    init: initCommand,
    add: addCommand,
    list: listCommand,
  },
});

runMain(main);
