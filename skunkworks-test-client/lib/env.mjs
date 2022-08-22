export default {
  document: typeof document === 'object',
  fetch: typeof fetch === 'function',
  global: typeof global === 'object',
  globalThis: typeof globalThis === 'object',
  versions: typeof process.versions !== 'undefined' && process.versions,
  version: typeof process.version !== 'undefined' && process.version,
  window: typeof window === 'object',
}
