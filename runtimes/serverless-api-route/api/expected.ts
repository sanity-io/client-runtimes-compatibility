import createClient, { environment, condition } from 'skunkworks-test-client'
import { projectId, dataset, apiVersion, query } from './_config'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req, res) {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  return res.json({
    result,
    environment,
    condition,
    'process.env.NEXT_RUNTIME': process.env.NEXT_RUNTIME,
  })
}
