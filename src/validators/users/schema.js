import Joi from 'joi'

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  fullname: Joi.string().required(),
  role: Joi.string().required(),
  password: Joi.string().required()
})

export default UserPayloadSchema
