export default {
  document: typeof document === 'object',
  EdgeRuntime: typeof EdgeRuntime === 'string' && EdgeRuntime,
  fetch: typeof fetch === 'function',
  global: typeof global === 'object',
  globalThis: typeof globalThis === 'object',
  version: typeof process.version !== 'undefined' && process.version,
  versions: typeof process.versions !== 'undefined' && process.versions,
  window: typeof window === 'object',
}
