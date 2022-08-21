// This import is only used by tooling that doesn't support pkg.exports, and is using ESM formats for tree-shaking and expects ES5, and expects node as the environment

import fetch from 'node-fetch'
import _condition from './module.node.condition.js'
import env from './env.mjs'

export default function (options) {
  var projectId = options.projectId
  var dataset = options.dataset
  return {
    env,
    fetch(query) {
      return fetch(
        'https://'
          .concat(projectId, '.apicdn.sanity.io/v2021-10-21/data/query/')
          .concat(dataset, '?query=')
          .concat(encodeURIComponent(query))
      )
        .then(function (res) {
          return res.json()
        })
        .then(function (json) {
          return json.result
        })
    },
  }
}
export var environment = 'ESM+ES5'
export var condition = _condition
