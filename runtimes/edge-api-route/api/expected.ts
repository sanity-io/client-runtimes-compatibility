import createClient, { entry } from 'skunkworks-test-client'
// @ts-ignore
import conditions from 'skunkworks-test-client/supports-conditions'
import { projectId, dataset, apiVersion, query } from './_config.mjs'

export const config = {
  runtime: 'edge',
}

export default async function handler() {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  return new Response(
    JSON.stringify({
      result,
      env: client.env,
      entry,
      conditions,
    }),
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
  )
}
