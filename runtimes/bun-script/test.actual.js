import { write } from 'bun'
import {
  createClient,
  unstable__adapter,
  unstable__environment,
} from '@sanity/client'

import { projectId, dataset, apiVersion, query } from './config.js'

let json
try {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  json = { result, unstable__adapter, unstable__environment }
} catch (err) {
  console.error(err)
  json = { error: err.stack || err.toString() }
}

await write('artifacts/actual.json', JSON.stringify(json))
