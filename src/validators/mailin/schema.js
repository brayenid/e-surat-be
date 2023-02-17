import Joi from 'joi'

const MailinPayloadSchema = Joi.object({
  nomorBerkas: Joi.string(),
  tanggalMasuk: Joi.string().required(),
  nomorSurat: Joi.string().required(),
  perihal: Joi.string().required(),
  pengantar: Joi.string()
})

const MailinUpdatePayloadSchema = Joi.object({
  nomorBerkas: Joi.string(),
  tanggalMasuk: Joi.string().required(),
  nomorSurat: Joi.string().required(),
  perihal: Joi.string().required(),
  pengantar: Joi.string()
})

export { MailinPayloadSchema, MailinUpdatePayloadSchema }
