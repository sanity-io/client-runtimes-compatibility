import { write } from 'bun'
import createClient, { target, condition } from 'skunkworks-test-client'

import { projectId, dataset, apiVersion, query } from './config.js'

const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
const result = await client.fetch(query)

await write(
  'artifacts/expected.json',
  JSON.stringify({ result, env: client.env, target, condition })
)
