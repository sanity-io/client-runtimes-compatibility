var Deno$version$deno = undefined
var process$env$NEXT_RUNTIME = undefined
var process$version = undefined
var process$versions = undefined

try {
  Deno$version$deno = Deno.version.deno
} catch (err) {
  // ignore
}
try {
  process$env$NEXT_RUNTIME = process.env.NEXT_RUNTIME
} catch (err) {
  // ignore
}
try {
  process$version = process.version
} catch (err) {
  // ignore
}
try {
  process$versions = Object.assign({}, process.versions, {
    webkit: undefined,
    mimalloc: undefined,
    libarchive: undefined,
    picohttpparser: undefined,
    boringssl: undefined,
    zlib: undefined,
    zig: undefined,
    uv: undefined,
    zlib: undefined,
    brotli: undefined,
    ares: undefined,
    nghttp2: undefined,
    napi: undefined,
    llhttp: undefined,
    openssl: undefined,
    cldr: undefined,
  })
} catch (err) {
  // ignore
}

module.exports = {
  document: typeof document === 'object',
  fetch: typeof fetch === 'function',
  global: typeof global === 'object',
  globalThis: typeof globalThis === 'object',
  window: typeof window === 'object',
  'Deno.version.deno': Deno$version$deno,
  'process.version': process$version,
  'process.versions': process$versions,
  'process.env.NEXT_RUNTIME': process$env$NEXT_RUNTIME,
  EdgeRuntime: typeof EdgeRuntime === 'string' ? EdgeRuntime : undefined,
}
