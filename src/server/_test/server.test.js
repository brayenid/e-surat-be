const createServer = require('../server')
describe('http server', () => {
  it('should response 404 for unregisted route', async () => {
    const server = await createServer()
    const response = await server.inject({
      method: 'GET',
      url: '/user'
    })

    const responseJson = JSON.parse(response.payload)

    expect(response.statusCode).toEqual(404)
    expect(responseJson.error).toEqual('Not Found')
  })
})
