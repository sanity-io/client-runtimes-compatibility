import { write } from 'bun'
import createClient, { entry } from '@sanity/runtimes-test-client'
import conditions from '@sanity/runtimes-test-client/supports-conditions'

import { projectId, dataset, apiVersion, query } from './config.js'

const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
const result = await client.fetch(query)

await write(
  'artifacts/expected.json',
  JSON.stringify({  runtime: 'bun', result, env: client.env, entry, conditions }),
)
