const routes = (handler) => [
  {
    method: 'POST',
    path: '/suratmasuk',
    handler: handler.postMailinHandler,
    options: {
      auth: 'esurat_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/suratmasuk/{id}',
    handler: handler.putMailinHandler,
    options: {
      auth: 'esurat_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/suratmasuk/{id}',
    handler: handler.deleteMailinHandler,
    options: {
      auth: 'esurat_jwt'
    }
  }
]

module.exports = routes
