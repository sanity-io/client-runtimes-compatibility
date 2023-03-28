const _browser = require('@sanity/runtimes-test-client/report-browser')
const _bun = require('@sanity/runtimes-test-client/report-bun')
const _deno = require('@sanity/runtimes-test-client/report-deno')
const _edge = require('@sanity/runtimes-test-client/report-edge')
const _electron = require('@sanity/runtimes-test-client/report-electron')
const _electron_browser = require('@sanity/runtimes-test-client/report-electron.browser')
const _electron_node = require('@sanity/runtimes-test-client/report-electron.node')
const _import = require('@sanity/runtimes-test-client/report-import')
const _module = require('@sanity/runtimes-test-client/report-module')
const _node = require('@sanity/runtimes-test-client/report-node')
const _node_deno = require('@sanity/runtimes-test-client/report-node.deno')
const _node_import = require('@sanity/runtimes-test-client/report-node.import')
const _node_module = require('@sanity/runtimes-test-client/report-node.module')
const _node_require = require('@sanity/runtimes-test-client/report-node.require')
const _react_native = require('@sanity/runtimes-test-client/report-react-native')
const _require = require('@sanity/runtimes-test-client/report-require')
const _webpack = require('@sanity/runtimes-test-client/report-webpack')
const _worker = require('@sanity/runtimes-test-client/report-worker')
const _worker_browser = require('@sanity/runtimes-test-client/report-worker.browser')
const _worker_node = require('@sanity/runtimes-test-client/report-worker.node')
const _worklet = require('@sanity/runtimes-test-client/report-worklet')
const _worklet_browser = require('@sanity/runtimes-test-client/report-worklet.browser')
const _worklet_node = require('@sanity/runtimes-test-client/report-worklet.node')

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
