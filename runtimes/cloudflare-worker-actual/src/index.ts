import createClient from '@sanity/client'

const projectId = '81pocpw8'
const dataset = 'production'
const apiVersion = 'v2021-03-25'
const query = /* groq */ `count(*[studioVersion == 3])`

export default {
  async fetch(): Promise<Response> {
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
          'Access-Control-Allow-Origin': '*',
          'content-type': 'application/json',
        },
      }
    )
  },
}
