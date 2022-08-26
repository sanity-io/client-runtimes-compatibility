import _browser from 'skunkworks-test-client/report-browser'
import _bun from 'skunkworks-test-client/report-bun'
import _deno from 'skunkworks-test-client/report-deno'
import _edge from 'skunkworks-test-client/report-edge'
import _electron from 'skunkworks-test-client/report-electron'
import _electron_browser from 'skunkworks-test-client/report-electron.browser'
import _electron_node from 'skunkworks-test-client/report-electron.node'
import _import from 'skunkworks-test-client/report-import'
import _module from 'skunkworks-test-client/report-module'
import _node from 'skunkworks-test-client/report-node'
import _node_deno from 'skunkworks-test-client/report-node.deno'
import _node_import from 'skunkworks-test-client/report-node.import'
import _node_module from 'skunkworks-test-client/report-node.module'
import _node_require from 'skunkworks-test-client/report-node.require'
import _react_native from 'skunkworks-test-client/report-react-native'
import _require from 'skunkworks-test-client/report-require'
import _webpack from 'skunkworks-test-client/report-webpack'
import _worker from 'skunkworks-test-client/report-worker'
import _worker_browser from 'skunkworks-test-client/report-worker.browser'
import _worker_node from 'skunkworks-test-client/report-worker.node'
import _worklet from 'skunkworks-test-client/report-worklet'
import _worklet_browser from 'skunkworks-test-client/report-worklet.browser'
import _worklet_node from 'skunkworks-test-client/report-worklet.node'

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
