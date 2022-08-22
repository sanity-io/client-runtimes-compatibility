import fs from 'node:fs/promises'
import createClient, { target, condition } from 'skunkworks-test-client'

import { projectId, dataset, apiVersion, query } from './config.js'

const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
const result = await client.fetch(query)

client.env['process.version'] = process.version

await fs.writeFile(
  'artifacts/expected.json',
  JSON.stringify({ result, env: client.env, target, condition })
)
