import createClientExpected, { entry } from 'npm:skunkworks-test-client'
import conditions from 'npm:skunkworks-test-client/supports-conditions'

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

  await Deno.writeTextFile(
    'artifacts/expected.json',
    JSON.stringify({
      result,
      env: client.env,
      entry,
      conditions: conditions.filter(Boolean),
    })
  )
}
async function actual() {
  let json
  try {
    const { default: createClientActual } = await import('npm:@sanity/client')
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
