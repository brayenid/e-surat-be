import routes from './routes.js'
import AuthenticationHandler from './handler.js'

export default {
  name: 'authentication',
  version: '1.0.0',
  register: async (server, { service, validator, userService, tokenManager }) => {
    const authenticationHandler = new AuthenticationHandler(service, validator, userService, tokenManager)
    server.route(routes(authenticationHandler))
  }
}
