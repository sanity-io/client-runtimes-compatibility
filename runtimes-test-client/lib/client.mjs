import env from './env.mjs'

export const createClient = ({ projectId, dataset }) => ({
  env,
  async fetch(query) {
    const _fetch =
      typeof fetch === 'function' ? fetch : await import('node-fetch')
    const res = await _fetch(
      `https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}?query=${encodeURIComponent(
        query,
      )}`,
    )
    const { result } = await res.json()
    return result
  },
})
