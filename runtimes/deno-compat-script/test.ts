// Run with `deno task test`
import createClientExpected, { target, condition } from 'skunkworks-test-client'
import createClientActual from '@sanity/client'

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

  client.env['Deno.version.deno'] = Deno.version.deno

  await Deno.writeTextFile(
    'artifacts/expected.json',
    JSON.stringify({ result, env: client.env, target, condition })
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

  await Deno.writeTextFile('artifacts/actual.json', JSON.stringify(json))
}

await Promise.all([expected(), actual()])
