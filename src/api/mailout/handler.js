class MailoutHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    this.postMailoutHandler = this.postMailoutHandler.bind(this)
    this.putMailoutHandler = this.putMailoutHandler.bind(this)
    this.deleteMailoutHandler = this.deleteMailoutHandler.bind(this)
    this.getMailoutHandler = this.getMailoutHandler.bind(this)
    this.getMailoutsBySearchHandler = this.getMailoutsBySearchHandler.bind(this)
  }

  async postMailoutHandler(request, h) {
    this._validator.validateMailoutPayload(request.payload)
    const { id: pengirim } = request.auth.credentials
    const newPayload = {
      ...request.payload,
      pengirim
    }
    const id = await this._service.addMail(newPayload)

    const response = h.response({
      status: 'success',
      message: 'New mail out added',
      data: {
        id
      }
    })
    response.code(201)
    return response
  }

  async putMailoutHandler(request, h) {
    const { id: mailId } = request.params
    this._validator.validateMailoutUpdatePayload(request.payload)
    await this._service.checkMailAvailability(mailId)
    const id = await this._service.updateMail(mailId, request.payload)
    const response = h.response({
      status: 'success',
      message: 'Mail out updated',
      data: {
        id
      }
    })
    response.code(200)
    return response
  }

  async deleteMailoutHandler(request, h) {
    const { id } = request.params
    await this._service.checkMailAvailability(id)
    await this._service.deleteMail(id)

    const response = h.response({
      status: 'success',
      message: 'Mail out deleted'
    })
    response.code(200)
    return response
  }

  async getMailoutHandler(request, h) {
    const { page, size } = request.query
    const { rows, rowCount } = await this._service.getMailouts(page, size)
    const response = h.response({
      status: 'success',
      dataLength: rowCount,
      data: rows
    })
    response.code(200)
    return response
  }

  async getMailoutsBySearchHandler(request, h) {
    const { q } = request.query
    if (!q) {
      const response = h.response({
        status: 'fail',
        message: 'Do not forget the query!'
      })
      response.code(404)
      return response
    }

    const data = await this._service.getMailoutsBySearchPerihal(q)

    const response = h.response({
      status: 'success',
      dataLength: data.length,
      data
    })
    response.code(200)
    return response
  }
}

module.exports = MailoutHandler
