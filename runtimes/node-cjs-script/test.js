const fs = require('fs/promises')

const projectId = '81pocpw8'
const dataset = 'production'
const apiVersion = 'v2021-03-25'
const query = /* groq */ `count(*[studioVersion == 3])`

async function expected() {
  const createClient = require('skunkworks-test-client')
  const { env, target, condition } = createClient
  const client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  const result = await client.fetch(query)

  await fs.writeFile(
    'expected.json',
    JSON.stringify({ result, env, target, condition })
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

  await fs.writeFile('actual.json', JSON.stringify(json))
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
