const InvariantError = require('../../exceptions/InvariantError.js')
const { AuthPayloadSchema, RefreshTokenPayloadSchema } = require('./schema.js')

const AuthValidator = {
  validateAuthPayload: (payload) => {
    const result = AuthPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  },
  validateRefreshTokenPayload: (payload) => {
    const result = RefreshTokenPayloadSchema.validate(payload)
    if (result.error) {
      throw new InvariantError(result.error.message)
    }
  }
}
module.exports = AuthValidator
