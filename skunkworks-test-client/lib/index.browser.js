// This import condition is used by modern tooling that is targetting browsers, but not workers or deno

import { createClient } from './client.mjs'

export const environment = 'ESM+ES2020'
export const condition = 'browser'

export default createClient
