// This import is only used by tooling that doesn't support pkg.exports, and is using ESM formats for tree-shaking and expects ES5, and expects node as the environment

import _entry from './module.entry.cjs'
import env from './env.mjs'

export default function (options) {
  var projectId = options.projectId
  var dataset = options.dataset
  return {
    env,
    fetch(query) {
      var fetcher =
        typeof fetch === 'function'
          ? Promise.resolve(fetch)
          : import('node-fetch')
      return fetcher
        .then(function (fetch) {
          return fetch(
            'https://'
              .concat(projectId, '.apicdn.sanity.io/v2021-10-21/data/query/')
              .concat(dataset, '?query=')
              .concat(encodeURIComponent(query))
          )
        })
        .then(function (res) {
          return res.json()
        })
        .then(function (json) {
          return json.result
        })
    },
  }
}
export var entry = 'module.js + ' + _entry
