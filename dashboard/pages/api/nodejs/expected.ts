import createClient, { entry } from 'skunkworks-test-client'
// @ts-ignore
import conditions from 'skunkworks-test-client/supports-conditions'
import { projectId, dataset, apiVersion, query } from 'config'

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req: any, res: any) {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  res.setHeader('Access-Control-Allow-Origin', '*')
  return res.json({
    result,
    env: client.env,
    entry,
    conditions,
  })
}
