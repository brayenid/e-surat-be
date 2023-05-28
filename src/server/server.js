const Hapi = require('@hapi/hapi')
const config = require('../../config.js')
const ClientError = require('../exceptions/ClientError.js')
const Jwt = require('@hapi/jwt')

//USERS
const users = require('../api/users/index.js')
const UserService = require('../services/UserService.js')
const UserValidator = require('../validators/users/index.js')

//AUTH
const authentication = require('../api/authentication/index.js')
const AuthenticationService = require('../services/AuthenticationService.js')
const AuthValidator = require('../validators/authentications/index.js')
const TokenManager = require('../utils/token/index.js')

//MAILIN
const mailin = require('../api/mailin/index.js')
const MailinService = require('../services/MailinService.js')
const MailinValidator = require('../validators/mailin/index.js')

//MAILOUT
const mailout = require('../api/mailout/index.js')
const MailoutService = require('../services/MailoutService.js')
const MailoutValidator = require('../validators/mailout/index.js')

const createServer = async () => {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port,
    routes: {
      cors: {
        origin: ['*'],
        credentials: true
      }
    }
  })

  // server.state('refreshToken', {
  //   ttl: 24 * 60 * 60 * 1000, // waktu expired dalam milidetik
  //   isHttpOnly: true,
  //   isSameSite: 'None',
  //   isSecure: false
  // })

  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({ value: 'hello world!' })
  })

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('esurat_jwt', 'jwt', {
    keys: config.token.access,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.maxAge
    },
    validate: (artifacts) => {
      return {
        isValid: true,
        credentials: {
          id: artifacts.decoded.payload.id,
          exp: artifacts.decoded.payload.exp
        }
      }
    }
  })

  await server.register([
    {
      plugin: users,
      options: {
        service: new UserService(),
        validator: UserValidator
      }
    },
    {
      plugin: authentication,
      options: {
        service: new AuthenticationService(),
        validator: AuthValidator,
        userService: new UserService(),
        tokenManager: TokenManager
      }
    },
    {
      plugin: mailin,
      options: {
        service: new MailinService(),
        validator: MailinValidator
      }
    },
    {
      plugin: mailout,
      options: {
        service: new MailoutService(),
        validator: MailoutValidator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Server error'
      })
      newResponse.code(500)
      return newResponse
    }
    return h.continue
  })

  return server
}

module.exports = createServer
