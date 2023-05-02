const Joi = require('joi')

const MailoutPayloadSchema = Joi.object({
  nomorBerkas: Joi.string(),
  alamatPenerima: Joi.string().required(),
  tanggalKeluar: Joi.string().required(),
  perihal: Joi.string().required()
})

const MailoutUpdatePayloadSchema = Joi.object({
  nomorBerkas: Joi.string(),
  alamatPenerima: Joi.string().required(),
  tanggalKeluar: Joi.string().required(),
  perihal: Joi.string().required()
})

module.exports = { MailoutPayloadSchema, MailoutUpdatePayloadSchema }
