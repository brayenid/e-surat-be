const MailoutHandler = require('./handler.js')
const routes = require('./routes.js')

module.exports = {
  name: 'mailout',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const mailoutHandler = new MailoutHandler(service, validator)
    server.route(routes(mailoutHandler))
  }
}
