const { Stacks } = require('./stack.json');

const camelToSnakeCase = string => {
  const firstLetter = string[0];
  const rest = string.slice(1, string.length);
  const restAsSnakeCase = rest.replace(/[A-Z]/g, letter => `_${letter}`);
  return `${firstLetter}${restAsSnakeCase}`.toUpperCase();
}

const outputsMap = Stacks.reduce(
  (acc, { Outputs }) => (
    Outputs.reduce((ac, { OutputKey, OutputValue }) => {
      ac[OutputKey] = OutputValue;
      return ac;
    }, acc
    )),
  {}
);

const bashLineJump = '\n';
const envFile = Object.entries(outputsMap).reduce((acc, [key, value]) => {
  acc += `${bashLineJump}export ${camelToSnakeCase(key)}=${value}${bashLineJump}`;
  return acc;
}, '');

console.log(envFile);
