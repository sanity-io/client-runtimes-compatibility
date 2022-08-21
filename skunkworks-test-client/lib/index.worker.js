// This import condition is used by modern tooling that is targetting workers, such as Cloudflare Workers, Vercel Edge runtimes and more

import { createClient } from './client.mjs'

export const target = 'ESM+ES2020'
export const condition = 'worker'

export default createClient
