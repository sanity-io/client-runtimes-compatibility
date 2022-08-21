import createClient, { environment, condition } from 'skunkworks-test-client'
import { projectId, dataset, apiVersion, query } from './_config.mjs'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req) {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  return new Response(
    JSON.stringify({
      result,
      environment,
      condition,
      'process.env.NEXT_RUNTIME': process.env.NEXT_RUNTIME,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
}
