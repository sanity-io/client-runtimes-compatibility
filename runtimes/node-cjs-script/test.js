'use strict'
const writeFile = require('write-file-atomic')
const { createClient } = require('@sanity/client')
const projectId = '81pocpw8'
const dataset = 'production'
const apiVersion = 'v2021-03-25'
const query = /* groq */ `count(*[studioVersion == 3])`
async function expected() {
  const createClient = require('@sanity/runtimes-test-client')
  const conditions = require('@sanity/runtimes-test-client/supports-conditions')
  const { entry } = createClient
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)
  await writeFile(
    'artifacts/expected.json',
    JSON.stringify({ result, env: client.env, entry, conditions })
  )
}
async function actual() {
  let json
  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
    const result = await client.fetch(query)
    json = { result }
  } catch (err) {
    console.error(err)
    json = { error: err instanceof Error ? err.stack : err }
  }
  await writeFile('artifacts/actual.json', JSON.stringify(json))
}
async function main() {
  await Promise.all([expected(), actual()])
  return 0
}
main()
  .then(process.exit)
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
