// This import condition is used by deno when it's running in Node.js compatibility mode.
// Normally it'll use the `worker` condition

import { createClient } from './client.mjs'

export const entry = 'exports.deno'

export default createClient
