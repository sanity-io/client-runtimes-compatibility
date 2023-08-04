import createClient, { entry } from '@sanity/runtimes-test-client'
// @ts-ignore
import conditions from '@sanity/runtimes-test-client/supports-conditions'
import { projectId, dataset, apiVersion, query } from 'config'

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
    },
  )
}
