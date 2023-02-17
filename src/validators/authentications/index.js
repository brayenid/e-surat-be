import InvariantError from '../../exceptions/InvariantError.js'
import { AuthPayloadSchema, RefreshTokenPayloadSchema } from './schema.js'

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

export default AuthValidator
