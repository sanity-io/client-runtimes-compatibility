export default {
  'Deno.version.deno':
    typeof Deno !== 'undefined' &&
    typeof Deno.version !== 'undefined' &&
    typeof Deno.version.deno !== 'undefined' &&
    Deno.version.deno,
  'process.env.NEXT_RUNTIME':
    typeof process !== 'undefined' &&
    typeof process.env !== 'undefined' &&
    process.env.NEXT_RUNTIME,
  'process.version':
    typeof process !== 'undefined' &&
    typeof process.version !== 'undefined' &&
    process.version,
  'process.versions':
    typeof process !== 'undefined' &&
    typeof process.versions !== 'undefined' &&
    process.versions,
  document: typeof document === 'object',
  EdgeRuntime: typeof EdgeRuntime === 'string' && EdgeRuntime,
  fetch: typeof fetch === 'function',
  global: typeof global === 'object',
  globalThis: typeof globalThis === 'object',
  window: typeof window === 'object',
}
