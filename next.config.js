module.exports = {
  api: {
    bodyParser: false,
    responseLimit: '200mb',
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    maxFileSize: 200 * 1024 * 1024, // 200MB in bytes
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    maxFileSize: '200MB',
  },
} 