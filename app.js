#!/usr/bin/env node
"use_strict";
const program = require("commander");
const { exec } = require("child_process");

const { echoString } = require("./data");

const addZero = (num) => {
  return num > 9 ? num : "0" + num;
};

const readableSeconds = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? addZero(h) + ":" : "00:";
  var mDisplay = m > 0 ? addZero(m) + ":" : "00:";
  var sDisplay = addZero(s);
  return hDisplay + mDisplay + sDisplay;
};

const execCallback = (error, stdout, stderr) => {
  if (error) console.log("exec error: " + error);
  if (stdout) console.log(stdout);
  if (stderr) console.log("shell error: " + stderr);
};



console.log("\033[2J");
exec('tput cup 0 0', execCallback);
const listFunction = (seconds, options) => {
  if (seconds >= 0) {
    const width = process.stdout.getWindowSize()[0];
    const height = process.stdout.getWindowSize()[1];
    const top = Math.abs((height - 5) / 2);
    const left = Math.abs((width - 47) / 2);
    exec('tput cup 0 0', execCallback);
    echoString(readableSeconds(seconds), top, left);

    setTimeout(() => {
      listFunction(seconds - 1, options);
    }, 1000);
  }
};

program
  .version("0.0.1")
  .command("timer [seconds]")
  .description("count down")
  .action(listFunction);

program.parse(process.argv);
