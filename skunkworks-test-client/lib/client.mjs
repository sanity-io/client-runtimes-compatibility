import env from './env.mjs'

export const createClient = ({ projectId, dataset }) => ({
  env,
  async fetch(query) {
    const fetch =
      typeof fetch === 'function' ? fetch : await import('node-fetch')
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}?query=${encodeURIComponent(
        query
      )}`
    )
    const { result } = await res.json()
    return result
  },
})
