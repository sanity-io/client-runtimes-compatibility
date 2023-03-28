// This import condition is not used by node directly.
// Node will use either exports.node.import or exports.node.require.
// This import condition is used by bundlers that are targetting node,
// and is an optimization gain: https://webpack.js.org/guides/package-exports/#providing-commonjs-and-esm-version-stateful

import { createClient } from './client.mjs'

export const entry = 'exports.node.module'

export default createClient
