/* eslint-disable no-console */

function time(label, func) {
  console.log({func})
  console.time(label);
  const res = func();
  console.timeEnd(label);
  return res;
}

module.exports = time;
