// This import condition is used by node, and bundlers targeting node, if the don't support the pkg.exports.node.module optimization
// It protects against the Dual package hazard: https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#dual-package-hazard

import createClient from './index.node.cjs'

export const entry = `exports.node.import+${createClient.entry}`

export default createClient
