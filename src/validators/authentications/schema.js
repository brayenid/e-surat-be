import Joi from 'joi'

const AuthPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

const RefreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required()
})

export { AuthPayloadSchema, RefreshTokenPayloadSchema }
