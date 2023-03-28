var process$isBun = undefined
var process$release$name = undefined
var navigator$UserAgent = undefined
var Deno$version$deno = undefined
var process$env$NEXT_RUNTIME = undefined
var process$version = undefined
var process$versions = undefined

try {
  process$isBun = process.isBun
} catch (err) {
  // ignore
}
try {
  process$release$name = process.release.name
} catch (err) {
  // ignore
}
try {
  navigator$UserAgent = navigator.userAgent
} catch (err) {
  // ignore
}
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
  process$versions = process.versions
    ? Object.assign({}, process.versions, {
        ares: undefined,
        boringssl: undefined,
        brotli: undefined,
        cldr: undefined,
        http_parser: undefined,
        icu: undefined,
        libarchive: undefined,
        llhttp: undefined,
        mimalloc: undefined,
        modules: undefined,
        napi: undefined,
        nghttp2: undefined,
        nghttp3: undefined,
        ngtcp2: undefined,
        openssl: undefined,
        picohttpparser: undefined,
        tz: undefined,
        unicode: undefined,
        uv: undefined,
        zig: undefined,
        zlib: undefined,
      })
    : undefined
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
    typeof location !== 'undefined' && 'location',
    typeof navigator !== 'undefined' && 'navigator',
  ].filter(Boolean),
  'process.isBun': process$isBun,
  'process.release.name': process$release$name,
  'navigator.userAgent': navigator$UserAgent,
  'Deno.version.deno': Deno$version$deno,
  'process.version': process$version,
  'process.versions': process$versions,
  'process.env.NEXT_RUNTIME': process$env$NEXT_RUNTIME,
  EdgeRuntime: typeof EdgeRuntime === 'string' ? EdgeRuntime : undefined,
}
