import createClient from '@sanity/client'
import { projectId, dataset, apiVersion, query } from './_config'

export default async function handler(req, res) {
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  return res.json({
    result,
  })
}
