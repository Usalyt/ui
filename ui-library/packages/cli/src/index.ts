#!/usr/bin/env node
import { defineCommand, runMain } from "citty";
import { initCommand } from "./commands/init";
import { addCommand } from "./commands/add";
import { listCommand } from "./commands/list";

const main = defineCommand({
  meta: {
    name: "tu-ui",
    version: "0.1.0",
    description: "CLI for distribution of tu-ui primitive components"
  },
  subCommands: {
    init: initCommand,
    add: addCommand,
    list: listCommand
  }
});

runMain(main);
