const InvariantError = require('../../exceptions/InvariantError.js')
const { MailoutPayloadSchema, MailoutUpdatePayloadSchema } = require('./schema.js')

const MailoutValidator = {
  validateMailoutPayload: (payload) => {
    const result = MailoutPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  },
  validateMailoutUpdatePayload: (payload) => {
    const result = MailoutUpdatePayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}

module.exports = MailoutValidator
