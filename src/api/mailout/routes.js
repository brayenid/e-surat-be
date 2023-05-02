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
  }
]
module.exports = routes
