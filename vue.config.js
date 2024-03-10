module.exports = {
  devServer: {
    port: 8888,
    proxy: {
      "/api": {
        target: "http://www.firefox.fun",
        changeOrigin: true,
        pathRewrite: {
          "/api": "",
        },
      },
    },
  },
};
