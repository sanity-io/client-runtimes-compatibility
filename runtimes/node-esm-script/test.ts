import { writeFile } from 'node:fs/promises'
import createClientExpected, { entry } from '@sanity/runtimes-test-client'
import conditions from '@sanity/runtimes-test-client/supports-conditions'
import {
  createClient as createClientActual,
  unstable__adapter,
  unstable__environment,
} from '@sanity/client'

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
    JSON.stringify({ result, env: client.env, entry, conditions }),
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
    json = { result, unstable__adapter, unstable__environment }
  } catch (err) {
    console.error(err)
    json = { error: err instanceof Error ? err.stack : err }
  }

  await writeFile('artifacts/actual.json', JSON.stringify(json))
}

await Promise.all([expected(), actual()])
