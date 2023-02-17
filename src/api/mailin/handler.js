import autoBind from 'auto-bind'

class MailinHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
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
    await this._service.deleteMail(id)

    const response = h.response({
      status: 'success',
      message: 'Mail in deleted'
    })
    response.code(200)
    return response
  }
}

export default MailinHandler