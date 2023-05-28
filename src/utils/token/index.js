const Jwt = require('@hapi/jwt')
const config = require('../../../config.js')
const InvariantError = require('../../exceptions/InvariantError.js')

const TokenManager = {
  generateAccessToken: (payload) => {
    const expiresIn = 30
    payload.exp = Math.floor(Date.now() / 1000) + expiresIn
    return Jwt.token.generate(payload, config.token.access)
  },
  generateRefreshToken: (payload) => {
    const expiresIn = 7 * 24 * 60 * 60 // 1 wks
    payload.exp = Math.floor(Date.now() / 1000) + expiresIn
    return Jwt.token.generate(payload, config.token.refresh)
  },
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

module.exports = TokenManager
