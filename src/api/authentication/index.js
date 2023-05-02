const routes = require('./routes.js')
const AuthenticationHandler = require('./handler.js')

module.exports = {
  name: 'authentication',
  version: '1.0.0',
  register: async (server, { service, validator, userService, tokenManager }) => {
    const authenticationHandler = new AuthenticationHandler(service, validator, userService, tokenManager)
    server.route(routes(authenticationHandler))
  }
}
