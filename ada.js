const {glob} = require('glob');
const jsfiles = await glob('./*/*.json', { ignore: 'node_modules/**' })
console.log(jsfiles)