import fetch from '#fetch'

export type ClientOptions = {
  projectId: string
  dataset: string
  apiVersion: string
  useCdn: boolean
}
export default function createClient({
  projectId,
  dataset,
  apiVersion,
}: ClientOptions) {
  return {
    async fetch(query: string) {
      const res = await fetch(
        `https://${projectId}.apicdn.sanity.io/${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(
          query
        )}`
      )
      const { result: data } = await res.json()
      return data
    },
  }
}
