const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError.js')

class MailoutService {
  constructor() {
    this._pool = new Pool()
  }

  async addMail(payload) {
    try {
      const { nomorBerkas, alamatPenerima, tanggalKeluar, perihal, pengirim } = payload
      const id = `suratkeluar-${nanoid(8)}`

      const query = {
        text: 'INSERT INTO surat_keluar VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
        values: [id, nomorBerkas, alamatPenerima, tanggalKeluar, perihal, pengirim]
      }

      const { rows } = await this._pool.query(query)

      return rows[0]
    } catch (error) {
      console.error(error)
      throw new InvariantError('Add new mail out failed!')
    }
  }

  async updateMail(id, payload) {
    try {
      const { nomorBerkas, alamatPenerima, tanggalKeluar, perihal } = payload
      const updated = true
      const query = {
        text: 'UPDATE surat_keluar SET nomor_berkas = $1, alamat_penerima = $2, tanggal_keluar = $3, perihal = $4, updated = $5 WHERE id = $6 RETURNING id',
        values: [nomorBerkas, alamatPenerima, tanggalKeluar, perihal, updated, id]
      }

      const { rows } = await this._pool.query(query)

      return rows[0].id
    } catch (error) {
      console.error(error)
      throw new InvariantError('Update mail in failed')
    }
  }

  async checkMailAvailability(id) {
    const query = {
      text: 'SELECT id FROM surat_keluar WHERE id = $1',
      values: [id]
    }

    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new InvariantError('Mail id is not valid')
    }

    return rows[0]
  }

  async deleteMail(id) {
    const query = {
      text: 'DELETE FROM surat_keluar WHERE id = $1',
      values: [id]
    }

    await this._pool.query(query)
  }
}

module.exports = MailoutService
