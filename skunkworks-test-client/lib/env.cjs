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
    ares: undefined,
    boringssl: undefined,
    brotli: undefined,
    cldr: undefined,
    http_parser: undefined,
    icu: false,
    libarchive: undefined,
    llhttp: undefined,
    mimalloc: undefined,
    modules: false,
    napi: undefined,
    nghttp2: undefined,
    nghttp3: undefined,
    ngtcp2: undefined,
    openssl: undefined,
    picohttpparser: undefined,
    tz: false,
    unicode: false,
    uv: undefined,
    zig: undefined,
    zlib: undefined,
  })
} catch (err) {
  // ignore
}

module.exports = {
  // As deno defines `window` the preferred way to check for the browser is `document`
  document: typeof document === 'object',
  // Check if native fetch is available
  fetch: typeof fetch === 'function',
  globals: [
    typeof globalThis !== 'undefined' && 'globalThis',
    typeof self !== 'undefined' && 'self',
    typeof window !== 'undefined' && 'window',
    typeof global !== 'undefined' && 'global',
  ].filter(Boolean),
  'Deno.version.deno': Deno$version$deno,
  'process.version': process$version,
  'process.versions': process$versions,
  'process.env.NEXT_RUNTIME': process$env$NEXT_RUNTIME,
  EdgeRuntime: typeof EdgeRuntime === 'string' ? EdgeRuntime : undefined,
}
