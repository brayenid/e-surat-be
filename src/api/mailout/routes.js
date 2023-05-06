const routes = (handler) => [
  {
    method: 'POST',
    path: '/suratkeluar',
    handler: handler.postMailoutHandler,
    options: {
      auth: 'esurat_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/suratkeluar/{id}',
    handler: handler.putMailoutHandler,
    options: {
      auth: 'esurat_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/suratkeluar/{id}',
    handler: handler.deleteMailoutHandler,
    options: {
      auth: 'esurat_jwt'
    }
  },
  {
    method: 'GET',
    path: '/suratkeluar',
    handler: handler.getMailoutHandler
  },
  {
    method: 'GET',
    path: '/suratkeluar/search',
    handler: handler.getMailoutsBySearchHandler
  }
]
module.exports = routes
