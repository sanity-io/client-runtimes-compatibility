// import createClient from '@sanity/client'
import { projectId, dataset, apiVersion, query } from './_config.mjs'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler() {
  // /*
  return new Response(
    JSON.stringify({
      error: `Build failed with 29 errors:
vc-file-system:runtimes/edge-api-route/node_modules/@sanity/client/package.json:2:8: error: Expected ";" but found ":"
vc-file-system:runtimes/edge-api-route/node_modules/core-util-is/lib/util.js:103:27: error: Could not resolve "buffer" (use "platform: 'node'" when building for node)
vc-file-system:runtimes/edge-api-route/node_modules/decompress-response/index.js:2:41: error: Could not resolve "stream" (use "platform: 'node'" when building for node)
vc-file-system:runtimes/edge-api-route/node_modules/decompress-response/index.js:3:21: error: Could not resolve "zlib" (use "platform: 'node'" when building for node)
vc-file-system:runtimes/edge-api-route/node_modules/follow-redirects/index.js:1:18: error: Could not resolve "url" (use "platform: 'node'" when building for node)`,
    }),
    {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
  // */
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
