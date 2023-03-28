// This import condition is used by modern tooling that is targetting workers, such as Cloudflare Workers, Vercel Edge runtimes and more

import { createClient } from './client.mjs'

export const entry = 'exports.worker'

export default createClient
