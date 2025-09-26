module.exports = function override(config, env) {
  // web worker
  config.module.rules.push({
    test: /\.worker\.ts$/i,
    loader: "worker-loader",
  })

  // Enable Fast Refresh
  config.devServer = {
    ...config.devServer,
    fastRefresh: true,
  }

  return config
}
