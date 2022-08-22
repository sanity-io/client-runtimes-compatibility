module.exports = {
  document: typeof document === 'object',
  fetch: typeof fetch === 'function',
  window: typeof window === 'object',
}
