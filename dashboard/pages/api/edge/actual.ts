import createClient from '@sanity/client'
import { projectId, dataset, apiVersion, query } from 'config'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler() {
  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
    const result = await client.fetch(query)
    return new Response(
      JSON.stringify({
        result,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.stack || err.toString(),
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    )
  }
}
