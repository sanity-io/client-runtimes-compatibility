// This import is used by legacy tooling that don't support pkg.exports, and don't understand pkg.module, or is bundling for ESM and is ignoring pkg.module

var env = require('./env.cjs')
var _condition = require('./main.node.condition.cjs')

module.exports = function (options) {
  var projectId = options.projectId
  var dataset = options.dataset
  return {
    env,
    fetch(query) {
      var _fetch = typeof fetch === 'function' ? fetch : require('node-fetch')
      return _fetch(
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
module.exports.target = 'CJS+ES5'
module.exports.condition = _condition
