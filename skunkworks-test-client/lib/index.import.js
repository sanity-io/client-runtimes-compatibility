// This import condition is used by modern tooling that is targetting ESM but not a specific environment like worker, deno, browser or node

import { createClient } from './client.mjs'

export const entry = 'exports.import'

export default createClient
