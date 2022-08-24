// Supported by webpack, rollup, wmr
// Allows optimizing Node.js without worrying about the dual hazard problem https://webpack.js.org/guides/package-exports/#providing-commonjs-and-esm-version-stateful
// Only relevant when bundling for Node.js as the target runtime and you want to remove the overhead of the ESM wrapper

module.exports = 'node.module'
