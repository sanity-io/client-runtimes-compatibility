export default async function handler(req, res) {
  return res.json({
    result: 'TODO', 
    'process.env.NEXT_RUNTIME': process.env.NEXT_RUNTIME,
  })
}
