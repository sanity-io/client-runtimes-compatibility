const env = require('./env.cjs')

module.exports.createClient = ({ projectId, dataset }) => ({
  env,
  async fetch(query) {
    const _fetch = typeof fetch === 'function' ? fetch : require('node-fetch')
    const res = await _fetch(
      `https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}?query=${encodeURIComponent(
        query,
      )}`,
    )
    const { result } = await res.json()
    return result
  },
})
