// @TODO crashes on bundling step if importing up here
// https://vercel.com/sanity-io/ecosystem-skunkworks-edge-api-route/FtoPZqXqgfMRS4sHmH8XbZzJKwhg
// import createClient from '@sanity/client'
import { projectId, dataset, apiVersion, query } from './_config.mjs'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler() {
  try {
    const result = await client.fetch(query)
    return new Response(
      JSON.stringify({
        result,
        'process.env.NEXT_RUNTIME': process.env.NEXT_RUNTIME,
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
