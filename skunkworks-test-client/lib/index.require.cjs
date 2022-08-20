// This import condition is used by modern tooling that is targetting CJS but not a specific environment like worker, deno, browser or node

const { createClient } = require('./client.cjs')

module.exports = createClient
module.exports.environment = 'CJS+ES2020'
module.exports.condition = 'require'
