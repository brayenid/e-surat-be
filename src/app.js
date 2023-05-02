const createServer = require('./server/server')
;(async () => {
  const server = await createServer()
  await server.start()
  console.log(`server start at ${server.info.uri}`)
})()
