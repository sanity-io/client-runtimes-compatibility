import cx from 'classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import { BookIcon } from '@sanity/icons'
import { Button } from '@sanity/ui'
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import stringify from 'fast-json-stable-stringify'
import {
  checks as checksSchema,
  output as outputSchema,
  type Check,
  type Checks,
  type Output,
} from 'lib/parsers'
import type { GetStaticProps } from 'next'
import Head from 'next/head'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { useEffect, useMemo, useState } from 'react'
import useSWR, { SWRConfig, useSWRConfig } from 'swr'

import data from 'public/checks.json'

const checksPath = '/checks.json'

type Props = {
  // fallback: Record<checksKey, Checks> | Record<string extends checksKey ? never : string, Output>
  // fallback: Record<checksKey, Checks> | Record<`/outputs/${string}` | `https://${string}`, Output>
  fallback: {
    [checksPath]: Checks
    [
      key:
        | `/outputs/${string}/${'expected' | 'actual'}.json`
        | `https://${string}`
    ]: Output
  }
}

// success/fail icon | name | runtime(node,bun,deno,edge,worker) | condition | target | native fetch | globals (window,self,document)
// available only in dialog: globals, document

const useDashboardData = () => {
  const { data, error } = useSWR<Checks>('/checks.json')
  const [initial] = useState(() => stringify(data))
  const hash = useMemo(() => stringify(data), [data])
  const changed = initial !== hash

  if (error) {
    throw error
  }

  return { data, changed }
}

const columnHelper = createColumnHelper<Check>()

const columns: ColumnDef<Check, any>[] = [
  columnHelper.display({
    id: 'status',
    cell: ({ row }) => {
      const { expected, actual } = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const expectedSwr = useSWR(expected)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const actualSwr = useSWR(actual)

      if (
        expectedSwr.error ||
        actualSwr.error ||
        expectedSwr.data?.error ||
        actualSwr.data?.error
      ) {
        return 'error'
      }

      if (expectedSwr.data?.result && actualSwr.data?.result) {
        return 'success'
      }

      if (
        (expectedSwr.isValidating && !expectedSwr.data) ||
        (actualSwr.isValidating && !actualSwr.data)
      ) {
        return 'pending'
      }

      console.warn(expectedSwr, actualSwr)
      return null
    },
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
]

function Table() {
  const table = useReactTable({
    data,
    // @ts-expect-error
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })
  return (
    <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
      <thead className="bg-gray-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  key={header.id}
                  scope="col"
                  colSpan={header.colSpan}
                  className={cx(
                    'sticky top-0 z-10 items-center border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8'
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <a
                      {...{
                        className: cx(
                          'group inline-flex',
                          header.column.getCanSort() && 'cursor-pointer'
                        ),
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span
                        className={cx(
                          header.column.getIsSorted()
                            ? 'ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300'
                            : 'invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible'
                        )}
                      >
                        {{
                          asc: (
                            <ChevronUpIcon
                              className="!block h-5 w-5"
                              aria-hidden="true"
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              className="!block h-5 w-5"
                              aria-hidden="true"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </a>
                  )}
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      <tbody className="bg-white">
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    className="whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function Dashboard() {
  const { data, changed } = useDashboardData()
  const { cache, mutate, ...extraConfig } = useSWRConfig()
  useEffect(() => {
    console.log({ cache })
  }, [cache])
  useEffect(() => {
    console.log({ mutate })
  }, [mutate])
  useEffect(() => {
    console.log({ extraConfig })
  }, [extraConfig])

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
      <Table />
    </>
  )
}

const fetcher = async (url: keyof Props['fallback']) => {
  const res = await fetch(url)
  const json = await res.json()
  switch (url) {
    case '/checks.json':
      return checksSchema.parse(json)
    default:
      return outputSchema.parse(json)
  }
}
export default function IndexPage({ fallback }: Props) {
  console.log(fallback['/outputs/da/expected.json'])
  return (
    <SWRConfig value={{ fallback, fetcher }}>
      <Dashboard />
    </SWRConfig>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const checksJson = checksSchema.parse(data)
  const fallback: Props['fallback'] = { '/checks.json': checksJson }
  const __dirname = fileURLToPath(import.meta.url)
  console.log(
    import.meta.url,
    __dirname,
    path.resolve(
      __dirname,
      '../../public/outputs/node-cjs-script-v16/actual.json'
    )
  )

  for (const check of checksJson) {
    if (check.type === 'artifact') {
      const expectedText = await fs.readFile(
        path.resolve(__dirname, `../../public${check.expected}`)
      )
      const expectedJson = JSON.parse(expectedText.toString())
      fallback[check.expected] = outputSchema.parse(expectedJson)
      const actualText = await fs.readFile(
        path.resolve(__dirname, `../../public${check.actual}`)
      )
      const actualJson = JSON.parse(actualText.toString())
      fallback[check.actual] = outputSchema.parse(actualJson)
    }
  }

  return { props: { fallback } }
}
