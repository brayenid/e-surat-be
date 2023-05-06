const AuthHelper = require('../../TestHelpers/AuthHelper.js')
const UserHelpers = require('../../TestHelpers/UserHelpers.js')
const createServer = require('../server.js')
const pool = require('../../TestHelpers/PoolHelper.js')

describe('authentications', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserHelpers.cleanTable()
    await AuthHelper.cleanTable()
  })

  describe('POST /auth', () => {
    it('should throw error for bad payload', async () => {
      const server = await createServer()
      const payload = {
        username: 'brayenid',
        password: 123
      }

      const response = await server.inject({
        method: 'POST',
        url: '/auth',
        payload
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should throw error if user was not available', async () => {
      const server = await createServer()
      const payload = {
        username: 'brayenid',
        password: '123'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/auth',
        payload
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(401)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Invalid credential')
    })

    it('should throw error for invalid password', async () => {
      const server = await createServer()
      await UserHelpers.addUser('invalid_pass_test')
      const payload = {
        username: 'brayenid',
        password: '321'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/auth',
        payload
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Wrong password')
    })

    it('should return token for valid auth', async () => {
      const server = await createServer()
      await UserHelpers.addUser()
      const payload = {
        username: 'brayenid',
        password: '123'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/auth',
        payload
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.accessToken).toBeDefined()
      expect(responseJson.data.refreshToken).toBeDefined()
    })
  })

  describe('PUT /auth', () => {
    it('should throw error for bad payload', async () => {
      const server = await createServer()
      const payload = {
        refreshToken: 123840489
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/auth',
        payload
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should throw error if token was not available', async () => {
      const server = await createServer()
      const payload = {
        refreshToken: '42js83jd03kd9randomtoken'
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/auth',
        payload
      })

      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Refresh token is invalid')
    })

    it('should return a new access token for valid refresh token', async () => {
      const server = await createServer()
      await UserHelpers.addUser()
      const loginPayload = {
        username: 'brayenid',
        password: '123'
      }

      //login first
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/auth',
        payload: loginPayload
      })
      const responseLoginJson = JSON.parse(responseLogin.payload)
      const { refreshToken } = responseLoginJson.data

      //make a put request with refresh token
      const responseRefreshTokenRequest = await server.inject({
        method: 'PUT',
        url: '/auth',
        payload: { refreshToken }
      })

      const responseRefreshTokenRequestJson = JSON.parse(responseRefreshTokenRequest.payload)

      expect(responseRefreshTokenRequest.statusCode).toEqual(200)
      expect(responseRefreshTokenRequestJson.status).toEqual('success')
      expect(responseRefreshTokenRequestJson.data.accessToken).toBeDefined()
    })
  })

  describe('DELETE /auth', () => {
    it('should throw error bad payload', async () => {
      const server = await createServer()
      const payload = {
        refreshToken: true
      }

      const response = await server.inject({
        method: 'DELETE',
        url: '/auth',
        payload
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toBeDefined()
    })

    it('should throw error for invalid refresh token', async () => {
      const server = await createServer()
      const payload = {
        refreshToken: 'thisisrandomnotavailable'
      }

      const response = await server.inject({
        method: 'DELETE',
        url: '/auth',
        payload
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Refresh token is invalid')
    })

    it('should delete refresh token correctly', async () => {
      await UserHelpers.addUser()
      const server = await createServer()

      //login first
      const loginPayload = {
        username: 'brayenid',
        password: '123'
      }
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/auth',
        payload: loginPayload
      })
      const responseLoginJson = JSON.parse(responseLogin.payload)
      const { refreshToken } = responseLoginJson.data

      //make sure that the refresh token is stored
      expect(await AuthHelper.findToken(refreshToken)).toHaveLength(1)

      //start to main test
      const responseDeleteToken = await server.inject({
        method: 'DELETE',
        url: '/auth',
        payload: { refreshToken }
      })
      const responseDeleteTokenJson = JSON.parse(responseDeleteToken.payload)

      expect(responseDeleteToken.statusCode).toEqual(200)
      expect(responseDeleteTokenJson.status).toEqual('success')
      expect(responseDeleteTokenJson.message).toEqual('Logout successfully')
    })
  })
})
