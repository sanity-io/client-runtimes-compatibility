import { z } from 'zod'

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
const json: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(json), z.record(json)])
)

const artifactCheck = z.object({
  type: z.literal('artifact'),
  name: z.string(),
  docs: z.string().url(),
  expected: z.custom<`/outputs/${string}/expected.json`>((val) =>
    /^\/outputs\/.*\/expected\.json$/g.test(val as string)
  ),
  actual: z.custom<`/outputs/${string}/actual.json`>((val) =>
    /^\/outputs\/.*\/actual\.json$/g.test(val as string)
  ),
})
export type ArtifactCheck = z.infer<typeof artifactCheck>

const serviceCheck = z.object({
  type: z.literal('service'),
  name: z.string(),
  docs: z.string().url(),
  expected: z.string().url(),
  actual: z.string().url(),
})
export type ServiceCheck = z.infer<typeof serviceCheck>

const check = z.discriminatedUnion('type', [artifactCheck, serviceCheck])
export type Check = z.infer<typeof check>

export const checks = z.array(check)
export type Checks = z.infer<typeof checks>

const envGlobalsEnum = z.enum([
  'globalThis',
  'self',
  'window',
  'global',
  'location',
  'navigator',
])
const semver = z.custom<`${number}.${number}.${number}`>((val) =>
  /^\d+\.\d+\.\d+$/g.test(val as string)
)
const looseSemver = z.custom<`v${z.infer<typeof semver>}`>((val) =>
  /^v\d+\.\d+\.\d+$/g.test(val as string)
)
const successExpectedOutput = z.object({
  result: json,
  env: z.object({
    document: z.boolean(),
    fetch: z.boolean(),
    globals: z.array(envGlobalsEnum),
    // https://github.com/oven-sh/bun-types/blob/7c3e6b1fbce0d12a41a9b960ae661252ae9feb35/globals.d.ts#L220-L221
    'process.isBun': z.union([z.literal(1), z.literal(true)]).optional(),
    // https://stackoverflow.com/a/35813135
    'process.release.name': z.literal('node').optional(),
    // https://developers.cloudflare.com/workers/runtime-apis/web-standards/#navigatoruseragent
    'navigator.userAgent': z
      .union([z.literal('Cloudflare-Workers'), z.string()])
      .optional(),
    'import.meta.url': z.string().optional(),
    'Deno.version.deno': semver.optional(),
    'process.version': looseSemver.optional(),
    'process.versions': z.record(semver).optional(),
    'process.env.NEXT_RUNTIME': z.string().optional(),
    EdgeRuntime: z.string().optional(),
  }),
})
const successActualOutput = z.object({
  result: json,
})
const failureOutput = z.object({
  error: z.string(),
})
export const output = z.union([
  successExpectedOutput,
  successActualOutput,
  failureOutput,
])
export type Output = z.infer<typeof output>
