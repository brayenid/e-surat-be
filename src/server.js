import Hapi from '@hapi/hapi'
import config from '../config.js'
import ClientError from './exceptions/ClientError.js'
import Jwt from '@hapi/jwt'

//USERS
import users from './api/users/index.js'
import UserService from './services/UserService.js'
import UserValidator from './validators/users/index.js'

//AUTH
import authentication from './api/authentication/index.js'
import AuthenticationService from './services/AuthenticationService.js'
import AuthValidator from './validators/authentications/index.js'
import TokenManager from './token/index.js'

//MAILIN
import mailin from './api/mailin/index.js'
import MailinService from './services/MailinService.js'
import MailinValidator from './validators/mailin/index.js'

const init = async () => {
  const server = Hapi.server({
    host: config.server.host,
    port: config.server.port,
    routes: {
      cors: {
        origin: ['*']
      }
    }
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
          id: artifacts.decoded.payload.id
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

  await server.start()
  console.log(`Server is running on ${server.info.uri}`)
}

init()
