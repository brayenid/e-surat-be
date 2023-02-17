import Jwt from '@hapi/jwt'
import config from '../../config.js'
import InvariantError from '../exceptions/InvariantError.js'
const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, config.token.access),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, config.token.refresh),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken)
      Jwt.token.verifySignature(artifacts, config.token.refresh)
      const { payload } = artifacts.decoded
      return payload
    } catch (error) {
      throw new InvariantError('Refresh token is invalid')
    }
  }
}

export default TokenManager
