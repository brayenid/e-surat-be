const routes = require('./routes.js')
const MailinHandler = require('./handler.js')

module.exports = {
  name: 'mailin',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const mailinHandler = new MailinHandler(service, validator)
    server.route(routes(mailinHandler))
  }
}
