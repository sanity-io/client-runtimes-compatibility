import _browser from '@sanity/runtimes-test-client/report-browser'
import _bun from '@sanity/runtimes-test-client/report-bun'
import _deno from '@sanity/runtimes-test-client/report-deno'
import _edge from '@sanity/runtimes-test-client/report-edge'
import _electron from '@sanity/runtimes-test-client/report-electron'
import _electron_browser from '@sanity/runtimes-test-client/report-electron.browser'
import _electron_node from '@sanity/runtimes-test-client/report-electron.node'
import _import from '@sanity/runtimes-test-client/report-import'
import _module from '@sanity/runtimes-test-client/report-module'
import _node from '@sanity/runtimes-test-client/report-node'
import _node_deno from '@sanity/runtimes-test-client/report-node.deno'
import _node_import from '@sanity/runtimes-test-client/report-node.import'
import _node_module from '@sanity/runtimes-test-client/report-node.module'
import _node_require from '@sanity/runtimes-test-client/report-node.require'
import _react_native from '@sanity/runtimes-test-client/report-react-native'
import _require from '@sanity/runtimes-test-client/report-require'
import _webpack from '@sanity/runtimes-test-client/report-webpack'
import _worker from '@sanity/runtimes-test-client/report-worker'
import _worker_browser from '@sanity/runtimes-test-client/report-worker.browser'
import _worker_node from '@sanity/runtimes-test-client/report-worker.node'
import _worklet from '@sanity/runtimes-test-client/report-worklet'
import _worklet_browser from '@sanity/runtimes-test-client/report-worklet.browser'
import _worklet_node from '@sanity/runtimes-test-client/report-worklet.node'

export default [
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
