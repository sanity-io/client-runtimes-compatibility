module.exports.createClient = ({ projectId, dataset }) => ({
  async fetch(query) {
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/v2021-10-21/data/query/${dataset}?query=${encodeURIComponent(
        query
      )}`
    )
    const { result } = await res.json()
    return result
  },
})
