import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid'
import { BookIcon } from '@sanity/icons'
import { Button } from '@sanity/ui'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import cx from 'classnames'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import fs from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { memo } from 'react'
import type { z } from 'zod'

import {
  checks as checksSchema,
  errorOutput,
  successOutputActual,
  successOutputExpected,
  type Check,
} from 'lib/parsers'
import checksJson from 'public/checks.json'

type Data = (
  | (Check &
      ({
        expectedResult: z.infer<typeof successOutputExpected>
        actualResult: z.infer<typeof successOutputActual>
      } & { status: 'success' }))
  | ({
      expectedResult:
        | z.infer<typeof successOutputExpected>
        | z.infer<typeof errorOutput>
      actualResult:
        | z.infer<typeof successOutputActual>
        | z.infer<typeof errorOutput>
    } & { status: 'error' | 'failure' })
)[]

const columnHelper = createColumnHelper<Data[number]>()

const columns: ColumnDef<Data[number], any>[] = [
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { status } = row.original

      switch (true) {
        case status === 'success':
          return <CheckCircleIcon className="h-5 w-5 text-green-600" />
        case status === 'failure':
          return <XCircleIcon className="h-5 w-5 text-red-700" />
        case status === 'error':
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
  }),
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor(
    (row) =>
      row.status === 'success' ? row.expectedResult.runtime : 'Unknown',
    {
      header: 'Runtime',
    },
  ),
  columnHelper.accessor(
    (row) => (row.status === 'success' ? row.expectedResult.entry : 'Unknown'),
    {
      header: 'Entry',
    },
  ),
  columnHelper.accessor(
    (row) => (row.status === 'success' ? row.expectedResult.conditions : []),
    {
      header: 'Conditions',
      cell: ({ getValue }) => getValue()?.join?.(', '),
    },
  ),
  columnHelper.accessor(
    (row) =>
      row.status === 'success' ? row.actualResult.unstable__adapter : 'unknown',
    {
      header: 'Adapter',
    },
  ),
  columnHelper.accessor(
    (row) =>
      row.status === 'success'
        ? row.actualResult.unstable__environment
        : 'unknown',
    {
      header: 'Environment',
    },
  ),
]

const Table = memo(function Table({ data }: { data: Data }) {
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

export const getStaticProps = (async () => {
  const checks = checksSchema
    .parse(checksJson)
    .sort((a, b) => a.name.localeCompare(b.name))
  const __dirname = fileURLToPath(import.meta.url)
  const data = [] as Data

  for (const check of checks) {
    const entry = { ...check } as (typeof data)[number]
    if (check.type === 'artifact') {
      const expectedText = await fs.readFile(
        path.resolve(__dirname, `../../public${check.expected}`),
      )
      const expectedJson = JSON.parse(expectedText.toString())
      entry.status = 'success'
      try {
        if (errorOutput.safeParse(expectedJson).success) {
          entry.expectedResult = errorOutput.parse(expectedJson)
          entry.status = 'error'
        } else {
          entry.expectedResult = successOutputExpected.parse(expectedJson)
        }
      } catch (err: any) {
        console.error('Failed while parsing', check.expected, expectedJson, err)
        entry.expectedResult = errorOutput.parse({
          error: err?.stack || err.toString(),
        })
        entry.status = 'error'
      }
      const actualText = await fs.readFile(
        path.resolve(__dirname, `../../public${check.actual}`),
      )
      const actualJson = JSON.parse(actualText.toString())
      try {
        if (errorOutput.safeParse(actualJson).success) {
          entry.actualResult = errorOutput.parse(actualJson)
          entry.status = 'error'
        } else {
          entry.actualResult = successOutputActual.parse(actualJson)
        }
      } catch (err: any) {
        console.error('Failed while parsing', check.actual, actualJson, err)
        entry.actualResult = errorOutput.parse({
          error: err?.stack || err.toString(),
        })
        entry.status = 'error'
      }
    }
    if (check.type === 'service') {
      entry.status = 'success'
      try {
        const expectedJson = await fetch(check.expected).then((res) =>
          res.json(),
        )
        if (errorOutput.safeParse(expectedJson).success) {
          entry.expectedResult = errorOutput.parse(expectedJson)
          entry.status = 'error'
        } else {
          entry.expectedResult = successOutputExpected.parse(expectedJson)
        }
      } catch (err: any) {
        console.error('Failed while parsing', check.expected, err)
        entry.expectedResult = errorOutput.parse({
          error: err?.stack || err.toString(),
        })
        entry.status = 'error'
      }
      try {
        const actualJson = await fetch(check.actual).then((res) => res.json())
        if (errorOutput.safeParse(actualJson).success) {
          entry.actualResult = errorOutput.parse(actualJson)
          entry.status = 'error'
        } else {
          entry.actualResult = successOutputActual.parse(actualJson)
        }
      } catch (err: any) {
        console.error('Failed while parsing', check.actual, err)
        entry.actualResult = errorOutput.parse({
          error: err?.stack || err.toString(),
        })
        entry.status = 'error'
      }
    }
    data.push(entry)
  }

  return { props: { data }, revalidate: 1 }
}) satisfies GetStaticProps

export default function Dashboard({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log({ data })

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
      <div className="">
        <Table data={data} />
      </div>
    </>
  )
}
