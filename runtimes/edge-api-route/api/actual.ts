export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req) {
  return new Response(JSON.stringify('TODO'), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}
