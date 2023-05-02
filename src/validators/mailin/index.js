const InvariantError = require('../../exceptions/InvariantError.js')
const { MailinPayloadSchema, MailinUpdatePayloadSchema } = require('./schema.js')

const MailinValidator = {
  validateMailinPayload: (payload) => {
    const result = MailinPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  },
  validateMailinUpdatePayload: (payload) => {
    const result = MailinUpdatePayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}

module.exports = MailinValidator
