import { BookIcon } from '@sanity/icons'
import { Button } from '@sanity/ui'
import stringify from 'fast-json-stable-stringify'
import type { GetStaticProps } from 'next'
import Head from 'next/head'
import { useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import data from 'public/checks.json'

type Data = typeof data
type Props = {
  fallback: {
    '/checks.json': Data
    [key: string]: any
  }
}

// success/fail icon | name | runtime(node,bun,deno,edge,worker) | condition | target | native fetch | globals (window,self,document)
// available only in dialog: globals, document

const useDashboardData = () => {
  const { data, error } = useSWR('/checks.json')
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
      <Head>
        <title>
          Can I use @sanity/client... Support tables for emerging JS runtimes
        </title>
      </Head>
      <div className="mx-auto max-w-7xl py-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-slate-900">
                <code className="py-1/2 rounded bg-slate-300 px-1 text-lg">
                  @sanity/client
                </code>{' '}
                compatibility with JS runtimes
              </h1>
              <p className="mt-2 text-sm text-slate-700">
                You should be able to use{' '}
                <code className="py-1/2 rounded bg-slate-300 px-1 text-sm">
                  @sanity/client
                </code>{' '}
                from any runtime, including{' '}
                <a
                  className="font-semibold hover:underline focus:underline"
                  href="https://developers.cloudflare.com/workers/"
                  rel="noopener noreferrer"
                >
                  Cloudflare Workers
                </a>
                ,{' '}
                <a
                  className="font-semibold hover:underline focus:underline"
                  href="https://deno.land/"
                  rel="noopener noreferrer"
                >
                  Deno
                </a>
                ,{' '}
                <a
                  className="font-semibold hover:underline focus:underline"
                  href="https://bun.sh/"
                  rel="noopener noreferrer"
                >
                  Bun
                </a>
                , and{' '}
                <a
                  className="font-semibold hover:underline focus:underline"
                  href="https://wintercg.org/"
                  rel="noopener noreferrer"
                >
                  more
                </a>
                .
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <Button
                mode="ghost"
                fontSize={1}
                as="a"
                text="Readme"
                icon={BookIcon}
                href="https://github.com/sanity-io/ecosystem-skunkworks-client-runtimes/blob/main/README.md"
              />
            </div>
          </div>
        </div>
      </div>
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
        '/checks.json': data,
      },
    },
  }
}
