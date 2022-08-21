// This import is used by legacy tooling that don't support pkg.exports, and don't understand pkg.module, or is bundling for ESM and is ignoring pkg.module

const fetch = require('node-fetch')
const env = require('./env.cjs')
const _condition = require('./main.node.condition.cjs')

module.exports = function (options) {
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
export var environment = 'CJS+ES5'
export var condition = _condition
