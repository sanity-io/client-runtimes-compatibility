import { writeFile } from 'node:fs/promises'
import createClientExpected, { entry } from 'skunkworks-test-client'
import conditions from 'skunkworks-test-client/supports-conditions'
import { createClient as createClientActual } from '@sanity/client'

const projectId = '81pocpw8'
const dataset = 'production'
const apiVersion = 'v2021-03-25'
const query = /* groq */ `count(*[studioVersion == 3])`

async function expected() {
  const client = createClientExpected({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  })
  const result = await client.fetch(query)

  await writeFile(
    'artifacts/expected.json',
    JSON.stringify({ result, env: client.env, entry, conditions })
  )
}
async function actual() {
  let json
  try {
    const client = createClientActual({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
    const result = await client.fetch(query)
    json = { result }
  } catch (err) {
    console.error(err)
    json = { error: err.stack || err.toString() }
  }

  await writeFile('artifacts/actual.json', JSON.stringify(json))
}

await Promise.all([expected(), actual()])
