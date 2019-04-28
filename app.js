#!/usr/bin/env node
"use_strict";
const program = require("commander");
const { version } = require("./package.json");

const { exit, start, echoTime } = require("./functions");

start();

program
  .version(version)
  .command("s [seconds]")
  .description("count down")
  .action(echoTime);

program.parse(process.argv);

// when user kills program
process.on("SIGINT", function() {
  exit();
});
process.on("beforeExit", function() {
  exit();
});
