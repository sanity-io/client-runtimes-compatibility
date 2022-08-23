import createClient, { target, condition } from 'skunkworks-test-client'
import { projectId, dataset, apiVersion, query } from './_config'

export default async function handler(req, res) {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.json({
    result,
    env: client.env,
    target,
    condition,
  })
}
