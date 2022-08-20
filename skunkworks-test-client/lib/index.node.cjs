// This import condition is used by node, and bundlers targeting node, if the don't support the pkg.exports.node.module optimization

const { createClient } = require('./client.cjs')

module.exports = createClient
module.exports.environment = 'CJS+Node16'
module.exports.condition = 'node.require'
