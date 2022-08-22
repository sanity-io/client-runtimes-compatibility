import stringify from 'fast-json-stable-stringify'
import type { GetStaticProps } from 'next'
import { useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import data from 'public/data.json'

type Props = {
  fallback: {
    '/data.json': typeof data
    [key: string]: any
  }
}

// success/fail icon | name | runtime(node,bun,deno,edge,worker) | condition | target | native fetch | globals (window,self,document)
// available only in dialog: globals, document

const useDashboardData = () => {
  const { data, error } = useSWR('/data.json')
  const [initial] = useState(() => stringify(data))
  const hash = useMemo(() => stringify(data), [data])
  const changed = initial !== hash

  if (error) {
    throw error
  }

  return { data, changed }
}

function Dashboard() {
  const { data, changed } = useDashboardData()
  return (
    <>
      Hello Hello
      <pre>{JSON.stringify({ data, changed }, null, 2)}</pre>
    </>
  )
}

const fetcher = (url) => fetch(url).then((res) => res.json())
export default function IndexPage({ fallback }: Props) {
  return (
    <SWRConfig value={{ fallback, revalidateOnMount: false, fetcher }}>
      <Dashboard />
    </SWRConfig>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      fallback: {
        '/data.json': data,
      },
    },
  }
}
