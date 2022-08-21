export default async function handler(req) {
  return new Response(JSON.stringify({
    result: 'TODO',
    'process.env.NEXT_RUNTIME': process.env.NEXT_RUNTIME
  }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  })
}
