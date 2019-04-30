const { exec } = require("child_process");
const { dictionary, symbol, empty } = require("./data");

/**
 * adds 0 if number is lower than 10
 * works with positive values
 * @param {number} num integer value
 */
const addZero = (num) => {
  return num > 9 ? num : "0" + num;
};

/**
 * make hh:mm:ss format
 * @param {number} d positive integer
 */
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

/**
 * Exec callback from exec function
 * @param {*} error
 * @param {*} stdout
 * @param {*} stderr
 */
const execCallback = (error, stdout, stderr) => {
  if (error) console.log("exec error: " + error);
  if (stdout) console.log(stdout);
  if (stderr) console.log("shell error: " + stderr);
};

/**
 * first function in program
 */
const start = () => {
  console.log("\033[2J");
  exec("tput cup 0 0", execCallback);
  exec("tput civis", execCallback);
};

/**
 * end function in program
 */
const exit = () => {
  exec("tput cnorm", (error, stdout, stderr) => {
    if (error) console.log("exec error: " + error);
    if (stdout) {
      console.log(stdout);

      process.exit(0);
    }
    if (stderr) console.log("shell error: " + stderr);
  });
};

/**
 *
 * @param {*} seconds
 * @param {*} options
 */
let cols,
  rows,
  firstLap = 0;
const echoTime = (seconds, options) => {
  if (seconds >= 0) {
    const width = process.stdout.getWindowSize()[0];
    const height = process.stdout.getWindowSize()[1];

    if (width !== cols || height !== rows) {
      console.log("\033[2J");
      cols = width;
      rows = height;
    }

    const top = Math.abs((height - 5) / 2);
    const left = Math.abs((width - 47) / 2);
    exec("tput cup 0 0", execCallback);
    echoString(readableSeconds(seconds), top, left);

    setTimeout(() => {
      if (firstLap < 2) {
        console.log("\033[2J");
        firstLap++;
      }
      echoTime(seconds - 1, options);
    }, 1000);
  }
};

/**
 * prints data on screen
 * @param {string} string text to show on screen
 * @param {number} top offset From top
 * @param {number} left offset from left
 */
const echoString = (string, top, left) => {
  for (let i = 0; i < top; i++) {
    console.log();
  }

  let prefix = "";
  for (let i = 0; i < left; i++) {
    prefix += empty;
  }

  const l = string.length;
  for (let i = 0; i < 5; i++) {
    line = prefix;
    for (let j = 0; j < l; j++) {
      for (let k = 0; k < 5; k++) {
        line += dictionary[string.charAt(j)][i][k] === 0 ? empty : symbol;
      }
      line += empty;
    }
    console.log(line);
  }
};

module.exports = {
  addZero,
  exit,
  execCallback,
  echoTime,
  readableSeconds,
  start
};
