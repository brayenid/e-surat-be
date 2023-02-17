import InvariantError from '../../exceptions/InvariantError.js'
import { MailinPayloadSchema, MailinUpdatePayloadSchema } from './schema.js'

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

export default MailinValidator
