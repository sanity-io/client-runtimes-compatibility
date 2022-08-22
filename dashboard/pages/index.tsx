import data from 'public/data.json'

export default function IndexPage() {
  return <>
  Hello Hello
  <pre>{JSON.stringify(data, null, 2)}</pre>
  </>
}