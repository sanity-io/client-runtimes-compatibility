import path from 'node:path'
import pkg from 'skunkworks-test-client/package.json' assert { type: 'json' }

const requires = []
const imports = []
const identifiers = []
for (const key of Object.keys(pkg.exports)) {
  if (key.startsWith('./report-')) {
    console.group(key)
    const entry = path.join('skunkworks-test-client', key)
    console.log(entry)
    const { default: result } = await import(entry)
    console.log(result)
    const identifier = `_${result.replace('.', '_').replace('-', '_')}`
    identifiers.push(identifier)
    requires.push(`const ${identifier} = require('${entry}')`)
    imports.push(`import ${identifier} from '${entry}'`)
    if (key !== `./report-${result}`) {
      throw new Error(`Wrong output for ${key}: ${result}`)
    }
    console.groupEnd()
  }
}

console.log(`
// report.cjs
${requires.join('\n')}

module.exports = [${identifiers.join(', ')}].filter(Boolean)

// report.js
${imports.join('\n')}

export default [${identifiers.join(', ')}].filter(Boolean)
`)
