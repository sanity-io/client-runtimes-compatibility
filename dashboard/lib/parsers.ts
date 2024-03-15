import { z } from 'zod'

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()])
type Literal = z.infer<typeof literalSchema>
type Json = Literal | { [key: string]: Json } | Json[]
const json: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(json), z.record(json)]),
)

const artifactCheck = z
  .object({
    type: z.literal('artifact'),
    name: z.string(),
    docs: z.string().url(),
    expected: z.custom<`/outputs/${string}/expected.json`>((val) =>
      /^\/outputs\/.*\/expected\.json$/g.test(val as string),
    ),
    actual: z.custom<`/outputs/${string}/actual.json`>((val) =>
      /^\/outputs\/.*\/actual\.json$/g.test(val as string),
    ),
  })
  .strict()
export type ArtifactCheck = z.infer<typeof artifactCheck>

const serviceCheck = z
  .object({
    type: z.literal('service'),
    name: z.string(),
    docs: z.string().url(),
    expected: z.string().url(),
    actual: z.string().url(),
  })
  .strict()
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
  /^\d+\.\d+\.\d+$/g.test(val as string),
)
const looseSemver = z.custom<`v${z.infer<typeof semver>}`>((val) =>
  /^v\d+\.\d+\.\d+$/g.test(val as string),
)
const successOutputActual = z
  .object({
    result: json,
    unstable__adapter: z.enum(['node', 'xhr', 'fetch']).optional(),
    unstable__environment: z.enum(['node', 'browser']).optional(),
  })
  .strict()
// `/expected` endpoints include debug information
const debugOutput = successOutputActual.extend({
  // TODO fill in from conditions, pkg.main shouuld be main, node.require should be exports.node.require
  entry: z.string(),
  // TODO fill in valid conditions
  conditions: z.array(z.string()).or(z.literal(false)),
})
const outputEnv = z
  .object({
    document: z.boolean(),
    fetch: z.boolean(),
    globals: z.array(envGlobalsEnum),
    'navigator.userAgent': z.string().optional(),
    'import.meta.url': z.string().optional(),
    'process.version': looseSemver.or(z.string()).optional(),
    'process.versions': z.record(z.union([semver, z.string()])).optional(),
    'process.env.NEXT_RUNTIME': z.string().optional(),
  })
  .strict()

const outputBun = debugOutput
  .extend({
    runtime: z.literal('bun'),
    env: outputEnv.extend({
      // https://github.com/oven-sh/bun-types/blob/7c3e6b1fbce0d12a41a9b960ae661252ae9feb35/globals.d.ts#L220-L221
      'process.isBun': z.literal(1).or(z.literal(true)),
    }),
  })
const outputDeno = debugOutput
  .extend({
    runtime: z.literal('deno'),
    env: outputEnv.extend({
      'Deno.version.deno': z.string(),
    }),
  })
const outputEdge = debugOutput
  .extend({
    runtime: z.literal('vercel-edge'),
    env: outputEnv.extend({
      // https://github.com/vercel/edge-runtime/blob/d570f01a3df237d91990177764a01e229b574f24/packages/ponyfill/src/index.js#L2
      EdgeRuntime: z.string(),
    }),
  })
const outputWorker = debugOutput
  .extend({
    runtime: z.literal('cloudflare-worker'),
    env: outputEnv.extend({
      // https://developers.cloudflare.com/workers/runtime-apis/web-standards/#navigatoruseragent
      'navigator.userAgent': z.literal('Cloudflare-Workers'),
    }),
  })
const outputNode = debugOutput
  .extend({
    runtime: z.literal('node'),
    env: outputEnv.extend({
      // https://stackoverflow.com/a/35813135
      'process.release.name': z.literal('node'),
    }),
  })
const successOutputExpected = z.discriminatedUnion('runtime',[
  outputBun,
  outputDeno,
  outputEdge,
  outputWorker,
  outputNode,
])
const successOutput = z.union([successOutputActual, successOutputExpected])
// Failure output is when the error is expected/supported
const failureOutput = z
  .object({
    failure: z.string(),
  })
  .strict()
// Unexpected errors, such as if Zod parsing failed
const errorOutput = z
  .object({
    error: z.string(),
  })
  .strict()
export const output = z.union([successOutput, failureOutput, errorOutput])
export type Output = z.infer<typeof output>
