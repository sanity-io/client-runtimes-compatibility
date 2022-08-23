let process$release$name = undefined
let navigator$UserAgent = undefined
let import$meta$url = undefined
let Deno$version$deno = undefined
let process$env$NEXT_RUNTIME = undefined
let process$version = undefined
let process$versions = undefined

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
  import$meta$url = import.meta.url
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

export default {
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
  'process.release.name': process$release$name,
  'navigator.userAgent': navigator$UserAgent,
  'import.meta.url': import$meta$url,
  'Deno.version.deno': Deno$version$deno,
  'process.version': process$version,
  'process.versions': process$versions,
  'process.env.NEXT_RUNTIME': process$env$NEXT_RUNTIME,
  EdgeRuntime: typeof EdgeRuntime === 'string' ? EdgeRuntime : undefined,
}
