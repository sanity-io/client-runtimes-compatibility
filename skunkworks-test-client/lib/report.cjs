const _browser = require('skunkworks-test-client/report-browser')
const _bun = require('skunkworks-test-client/report-bun')
const _deno = require('skunkworks-test-client/report-deno')
const _edge = require('skunkworks-test-client/report-edge')
const _electron = require('skunkworks-test-client/report-electron')
const _electron_browser = require('skunkworks-test-client/report-electron.browser')
const _electron_node = require('skunkworks-test-client/report-electron.node')
const _import = require('skunkworks-test-client/report-import')
const _module = require('skunkworks-test-client/report-module')
const _node = require('skunkworks-test-client/report-node')
const _node_deno = require('skunkworks-test-client/report-node.deno')
const _node_import = require('skunkworks-test-client/report-node.import')
const _node_module = require('skunkworks-test-client/report-node.module')
const _node_require = require('skunkworks-test-client/report-node.require')
const _react_native = require('skunkworks-test-client/report-react-native')
const _require = require('skunkworks-test-client/report-require')
const _webpack = require('skunkworks-test-client/report-webpack')
const _worker = require('skunkworks-test-client/report-worker')
const _worker_browser = require('skunkworks-test-client/report-worker.browser')
const _worker_node = require('skunkworks-test-client/report-worker.node')
const _worklet = require('skunkworks-test-client/report-worklet')
const _worklet_browser = require('skunkworks-test-client/report-worklet.browser')
const _worklet_node = require('skunkworks-test-client/report-worklet.node')

module.exports = [
  _browser,
  _bun,
  _deno,
  _edge,
  _electron,
  _electron_browser,
  _electron_node,
  _import,
  _module,
  _node,
  _node_deno,
  _node_import,
  _node_module,
  _node_require,
  _react_native,
  _require,
  _webpack,
  _worker,
  _worker_browser,
  _worker_node,
  _worklet,
  _worklet_browser,
  _worklet_node,
].filter(Boolean)
