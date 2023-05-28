class MailinHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postMailinHandler = this.postMailinHandler.bind(this)
    this.putMailinHandler = this.putMailinHandler.bind(this)
    this.deleteMailinHandler = this.deleteMailinHandler.bind(this)
    this.getMailinHandler = this.getMailinHandler.bind(this)
    this.getMailinsBySearchHandler = this.getMailinsBySearchHandler.bind(this)
    this.getMailinDetailHandler = this.getMailinDetailHandler.bind(this)
    this.getMailinsTotalHandler = this.getMailinsTotalHandler.bind(this)
  }

  async postMailinHandler(request, h) {
    this._validator.validateMailinPayload(request.payload)

    const { id: penerima } = request.auth.credentials
    const newPayload = {
      ...request.payload,
      penerima
    }
    const id = await this._service.addMail(newPayload)

    const response = h.response({
      status: 'success',
      message: 'New mail in added',
      data: {
        id
      }
    })
    response.code(201)
    return response
  }

  async putMailinHandler(request, h) {
    const { id: mailId } = request.params
    this._validator.validateMailinUpdatePayload(request.payload)
    await this._service.checkMailAvailability(mailId)
    const id = await this._service.updateMail(mailId, request.payload)
    const response = h.response({
      status: 'success',
      message: 'Mail in updated',
      data: {
        id
      }
    })
    response.code(200)
    return response
  }

  async deleteMailinHandler(request, h) {
    const { id } = request.params
    await this._service.checkMailAvailability(id)
    await this._service.deleteMail(id)

    const response = h.response({
      status: 'success',
      message: 'Mail in deleted'
    })
    response.code(200)
    return response
  }

  async getMailinHandler(request, h) {
    const { page, size } = request.query
    const data = await this._service.getMailins(page, size)

    const response = h.response({
      status: 'success',
      dataLength: data.length,
      data
    })
    response.code(200)
    return response
  }

  async getMailinsBySearchHandler(request, h) {
    const { q } = request.query
    if (!q) {
      const response = h.response({
        status: 'fail',
        message: 'Do not forget the query!'
      })
      response.code(404)
      return response
    }

    const data = await this._service.getMailinsBySearch(q)

    const response = h.response({
      status: 'success',
      dataLength: data.length,
      data
    })
    response.code(200)
    return response
  }

  async getMailinDetailHandler(request, h) {
    const { id } = request.params
    const data = await this._service.getMailinDetail(id)

    const response = h.response({
      status: 'success',
      data
    })
    response.code(200)
    return response
  }

  async getMailinsTotalHandler(request, h) {
    const total = await this._service.getMailinsTotal()
    const mailSource = await this._service.getMailinsSourceFrequency()

    const response = h.response({
      status: 'success',
      data: {
        total,
        mailSource
      }
    })
    response.code(200)
    return response
  }
}

module.exports = MailinHandler
