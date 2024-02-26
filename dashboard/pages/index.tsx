import { useImmer } from 'use-immer'
import cx from 'classnames'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid'
import { BookIcon } from '@sanity/icons'
import { Button } from '@sanity/ui'
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  TableMeta,
  RowData,
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
import path from 'path'
import { fileURLToPath } from 'node:url'
import { useEffect, useMemo, useState, memo } from 'react'
import useSWR, { SWRConfig, useSWRConfig, type Cache } from 'swr'
import type { Merge } from 'type-fest'

import data from 'public/checks.json'

const checksPath = '/checks.json'

type Status = 'pending' | 'error' | 'failure' | 'success'

type CheckWithOutputs = Merge<
  Check,
  {
    outputs: {
      expected: Merge<Output, { status: Status }>
      actual: Merge<Output, { status: Status }>
    }
  }
>
type Data = {
  statuses: {
    error: number
    failing: number
    pending: number
    success: number
  }
  checks: CheckWithOutputs[]
}

type InitialData = {
  [checksPath]: Checks
  [
    key:
      | `/outputs/${string}/${'expected' | 'actual'}.json`
      | `https://${string}`
  ]: Output
}

type Props = {
  // fallback: Record<checksKey, Checks> | Record<string extends checksKey ? never : string, Output>
  // fallback: Record<checksKey, Checks> | Record<`/outputs/${string}` | `https://${string}`, Output>
  fallback: InitialData
}

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    cache: Cache
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

const columnHelper = createColumnHelper<CheckWithOutputs>()

function getStatus(output: Output | undefined): Status {
  if (!output) return 'pending'
  switch (true) {
    case 'failure' in output:
      return 'failure'
    case 'error' in output:
      return 'error'
    case 'result' in output:
      return 'success'
    default:
      return 'pending'
  }
}
const columns: ColumnDef<CheckWithOutputs, any>[] = [
  columnHelper.accessor(
    // @ts-expect-error
    (row: any) => {
      const expectedStatus = row.outputs?.expected?.status
      const actualStatus = row.outputs?.actual?.status

      switch (true) {
        case expectedStatus === 'success' && actualStatus === 'success':
          return 'success'
        case expectedStatus === 'failure' || actualStatus === 'failure':
          return 'failure'
        case expectedStatus === 'error' || actualStatus === 'error':
          return 'error'
        default:
          return 'pending'
      }
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { expected, actual } = row.original.outputs

        switch (true) {
          case expected.status === 'success' && actual.status === 'success':
            return <CheckCircleIcon className="h-5 w-5 text-green-600" />
          case expected.status === 'failure' || actual.status === 'failure':
            return <XCircleIcon className="h-5 w-5 text-red-700" />
          case expected.status === 'error' || actual.status === 'error':
            return <ExclamationCircleIcon className="h-5 w-5 text-red-700" />
          default:
            return (
              <svg
                className="box-content h-4 w-4 animate-spin p-1 text-slate-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )
        }
      },
    },
  ),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  // @ts-expect-error
  columnHelper.accessor((row) => row.outputs?.expected?.runtime, {
    header: 'Runtime',
  }),
  // @ts-expect-error
  columnHelper.accessor((row) => row.outputs?.expected?.entry, {
    header: 'Entry',
  }),
  // @ts-expect-error
  columnHelper.accessor((row) => row.outputs?.expected?.conditions, {
    header: 'Conditions',
    cell: ({ getValue }) => getValue()?.join?.(', '),
  }),
  // @ts-expect-error
  columnHelper.accessor((row) => row.outputs?.actual?.unstable__adapter, {
    header: 'Adapter',
  }),
  // @ts-expect-error
  columnHelper.accessor((row) => row.outputs?.actual?.unstable__environment, {
    header: 'Environment',
  }),
]

const Table = memo(function Table({ data }: { data: CheckWithOutputs[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })
  return (
    <table
      className="min-w-full max-w-[100vw] border-separate divide-y divide-gray-300 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
      style={{ borderSpacing: 0 }}
    >
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
                    'sticky top-0 z-10 items-center border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8',
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <a
                      {...{
                        className: cx(
                          'group inline-flex sticky left-4 right-4',
                          header.column.getCanSort() && 'cursor-pointer',
                        ),
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      <span
                        className={cx(
                          header.column.getIsSorted()
                            ? 'ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300'
                            : 'invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible',
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
})

function CheckLoader({
  check,
  setCache,
}: {
  check: Check
  setCache: (key: string) => void
}) {
  const expected = useSWR(check.expected)
  const actual = useSWR(check.actual)
  useEffect(() => {
    if (expected.data) {
      // @ts-expect-error
      setCache((cache) => {
        cache.set(check.expected, expected.data)
      })
    } else if (expected.error) {
      // @ts-expect-error
      setCache((cache) => {
        cache.set(check.expected, {
          error: expected.error,
        })
      })
    }
  }, [check.expected, expected.data, expected.error, setCache])
  useEffect(() => {
    if (actual.data) {
      // @ts-expect-error
      setCache((cache) => {
        cache.set(check.actual, actual.data)
      })
    } else if (actual.error) {
      // @ts-expect-error
      setCache((cache) => {
        cache.set(check.actual, {
          error: actual.error,
        })
      })
    }
  }, [check.actual, actual.data, actual.error, setCache])
  return null
}

function Dashboard({ initial }: { initial: InitialData }) {
  const { data: checks, changed } = useDashboardData()
  const [cache, setCache] = useImmer(() => new Map(Object.entries(initial)))

  // @ts-expect-error
  const data = useMemo<CheckWithOutputs[]>(() => {
    console.log('useMemo data', checks)
    return checks?.map((check) => {
      const expectedOutput = cache.get(check.expected)
      const actualOutput = cache.get(check.actual)
      console.log('useMemo data', check, expectedOutput, actualOutput)
      return {
        ...check,
        outputs: {
          expected: {
            // @ts-expect-error
            status: expectedOutput?.error
              ? 'error'
              : // @ts-expect-error
                expectedOutput?.failure
                ? 'failure'
                : // @ts-expect-error
                  expectedOutput?.result
                  ? 'success'
                  : 'pending',
            ...expectedOutput,
          },
          actual: {
            // @ts-expect-error
            status: actualOutput?.error
              ? 'error'
              : // @ts-expect-error
                actualOutput?.failure
                ? 'failure'
                : // @ts-expect-error
                  actualOutput?.result
                  ? 'success'
                  : 'pending',
            ...actualOutput,
          },
        },
      }
    })
  }, [cache, checks])
  console.log({ checks })
  return (
    <>
      {checks?.map((check) => (
        <CheckLoader
          key={check.expected}
          check={check}
          // @ts-expect-error
          setCache={setCache}
        />
      ))}
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
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
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
      <div className="">{data ? <Table data={data} /> : 'Loading data...'}</div>
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
  return (
    <SWRConfig value={{ fallback, fetcher }}>
      <Dashboard initial={fallback} />
    </SWRConfig>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const checksJson = checksSchema.parse(data)
  const fallback: Props['fallback'] = {
    '/checks.json': checksJson.sort((a, b) => a.name.localeCompare(b.name)),
  }
  const __dirname = fileURLToPath(import.meta.url)
  console.log(
    import.meta.url,
    __dirname,
    path.resolve(
      __dirname,
      '../../public/outputs/node-cjs-script-v16/actual.json',
    ),
  )

  for (const check of checksJson) {
    if (check.type === 'artifact') {
      const expectedText = await fs.readFile(
        path.resolve(__dirname, `../../public${check.expected}`),
      )
      const expectedJson = JSON.parse(expectedText.toString())
      try {
        fallback[check.expected] = outputSchema.parse(expectedJson)
      } catch (err: any) {
        console.error('Failed while parsing', check.expected, expectedJson, err)
        fallback[check.expected] = { error: err?.stack || err.toString() }
      }
      const actualText = await fs.readFile(
        path.resolve(__dirname, `../../public${check.actual}`),
      )
      const actualJson = JSON.parse(actualText.toString())
      try {
        fallback[check.actual] = outputSchema.parse(actualJson)
      } catch (err: any) {
        console.error('Failed while parsing', check.actual, actualJson, err)
        fallback[check.actual] = { error: err?.stack || err.toString() }
      }
    }
    if (check.type === 'service') {
      try {
        const expectedJson = await fetch(check.expected).then((res) =>
          res.json(),
        )
        fallback[check.expected as any] = outputSchema.parse(expectedJson)
      } catch (err: any) {
        console.error('Failed while parsing', check.expected, err)
        fallback[check.expected as any] = {
          error: err?.stack || err.toString(),
        }
      }
      try {
        const actualJson = await fetch(check.actual).then((res) => res.json())
        fallback[check.actual as any] = outputSchema.parse(actualJson)
      } catch (err: any) {
        console.error('Failed while parsing', check.actual, err)
        fallback[check.actual as any] = { error: err?.stack || err.toString() }
      }
    }
  }

  return { props: { fallback } }
}
