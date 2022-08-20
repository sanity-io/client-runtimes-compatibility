// This import condition is used by modern tooling that is targetting deno, but not workers

import { createClient } from './client.mjs'

export const environment = 'ESM+ES2020'
export const condition = 'deno'

export default createClient
