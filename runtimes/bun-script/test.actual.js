import fs from 'node:fs/promises'
import createClient from '@sanity/client'

import { projectId, dataset, apiVersion, query } from './config.js'

let json
try {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  json = { result }
} catch (err) {
  console.error(err)
  json = { error: err.stack || err.toString() }
}

await fs.writeFile('artifacts/actual.json', JSON.stringify(json))
