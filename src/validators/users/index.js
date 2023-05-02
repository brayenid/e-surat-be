const InvariantError = require('../../exceptions/InvariantError.js')
const UserPayloadSchema = require('./schema.js')

const UserValidator = {
  validateUserPayload: (payload) => {
    const result = UserPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}

module.exports = UserValidator
