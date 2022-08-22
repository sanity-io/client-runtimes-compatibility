var Deno$version$deno = false
var process$env$NEXT_RUNTIME = false
var process$version = false
var process$versions = false

try {
  Deno$version$deno = Deno.version.deno
} catch (err) {
  // ignore
}
try {
  process$env$NEXT_RUNTIME = process.env.NEXT_RUNTIME || false
} catch (err) {
  // ignore
}
try {
  process$version = process.version
} catch (err) {
  // ignore
}
try {
  process$versions = process.versions
} catch (err) {
  // ignore
}

export default {
  'Deno.version.deno': Deno$version$deno,
  'process.env.NEXT_RUNTIME': process$env$NEXT_RUNTIME,
  'process.version': process$version,
  'process.versions': process$versions,
  document: typeof document === 'object',
  EdgeRuntime: typeof EdgeRuntime === 'string' && EdgeRuntime,
  fetch: typeof fetch === 'function',
  global: typeof global === 'object',
  globalThis: typeof globalThis === 'object',
  window: typeof window === 'object',
}
