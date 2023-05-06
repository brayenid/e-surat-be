const UserHelpers = require('../../TestHelpers/UserHelpers.js')
const createServer = require('../server.js')
const pool = require('../../TestHelpers/PoolHelper.js')

describe('users', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserHelpers.cleanTable()
  })

  describe('POST /users', () => {
    it('should throw error for bad payload', async () => {
      const server = await createServer()
      const payload = {
        username: 'brayenid',
        fullname: true,
        role: 'helo',
        password: '123'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })
      const responseJson = JSON.parse(response.payload)

      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should add user correctly', async () => {
      const server = await createServer()
      const payload = {
        username: 'brayenid',
        fullname: 'brayen luhat',
        role: 'helo',
        password: '123'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(typeof responseJson.data.id).toEqual('string')
    })
  })
})
