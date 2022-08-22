import createClient, { target, condition } from 'skunkworks-test-client'
import { projectId, dataset, apiVersion, query } from '../_config'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler() {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  return new Response(
    JSON.stringify({
      result,
      env: client.env,
      target,
      condition,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}