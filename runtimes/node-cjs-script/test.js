const path = require('path')
const writeFile = require('write-file-atomic')

const projectId = '81pocpw8'
const dataset = 'production'
const apiVersion = 'v2021-03-25'
const query = /* groq */ `count(*[studioVersion == 3])`

async function expected() {
  const createClient = require('skunkworks-test-client')
  const { target, condition } = createClient
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)

  client.env['process.version'] = process.version

  await writeFile(
    path.resolve(process.cwd(), 'artifacts/expected.cjs.json'),
    JSON.stringify({ result, env: client.env, target, condition })
  )
}
async function actual() {
  let json
  try {
    const createClient = require('@sanity/client')
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
    json = { error: err.toString() }
  }

  await writeFile(
    path.resolve(process.cwd(), 'artifacts/actual.cjs.json'),
    JSON.stringify(json)
  )
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
