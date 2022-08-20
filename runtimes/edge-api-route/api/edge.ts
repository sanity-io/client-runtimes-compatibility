import createClient, { environment, condition } from 'skunkworks-test-client'

export const config = {
  runtime: 'experimental-edge',
}

const projectId = '81pocpw8'
const dataset = 'production'
const apiVersion = 'v2021-03-25'
const query = /* groq */ `count(*[studioVersion == 3])`

export default async function handler(req) {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  return new Response(
    JSON.stringify({
      result,
      environment,
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
