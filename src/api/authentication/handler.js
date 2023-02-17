import autoBind from 'auto-bind'
class AuthenticationHandler {
  constructor(service, validator, userService, tokenManager) {
    this._service = service
    this._validator = validator
    this._userService = userService
    this._tokenManager = tokenManager

    autoBind(this)
  }

  async postAuthHandler(request, h) {
    this._validator.validateAuthPayload(request.payload)

    const { username, password } = request.payload
    const id = await this._userService.verifyUserCredential(username, password)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    const refreshToken = this._tokenManager.generateRefreshToken({ id })

    await this._service.addRefreshToken(refreshToken)

    const response = h.response({
      status: 'success',
      message: 'Login success',
      data: {
        accessToken,
        refreshToken
      }
    })
    response.code(200)
    return response
  }

  async putAuthHandler(request, h) {
    await this._validator.validateRefreshTokenPayload(request.payload)
    const { refreshToken } = request.payload
    await this._service.verifyRefreshToken(refreshToken)

    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)
    const accessToken = this._tokenManager.generateAccessToken({ id })

    const response = h.response({
      status: 'success',
      data: {
        accessToken
      }
    })
    response.code(200)
    return response
  }

  async deleteAuthHandler(request, h) {
    const { refreshToken } = request.payload
    await this._service.verifyRefreshToken(refreshToken)
    await this._service.deleteRefreshToken(refreshToken)

    const response = h.response({
      status: 'success',
      message: 'Logout successfully'
    })
    response.code(200)
    return response
  }
}

export default AuthenticationHandler
