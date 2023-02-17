import routes from './routes.js'
import MailinHandler from './handler.js'

export default {
  name: 'mailin',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const mailinHandler = new MailinHandler(service, validator)
    server.route(routes(mailinHandler))
  }
}
