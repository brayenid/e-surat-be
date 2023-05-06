const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError.js')

class MailinService {
  constructor() {
    this._pool = new Pool()
  }

  async addMail(payload) {
    try {
      const { nomorBerkas, tanggalMasuk, nomorSurat, perihal, pengantar, penerima } = payload
      const id = `suratmasuk-${nanoid(8)}`

      const query = {
        text: 'INSERT INTO surat_masuk VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        values: [id, nomorBerkas, tanggalMasuk, nomorSurat, perihal, pengantar, penerima]
      }

      const { rows } = await this._pool.query(query)
      return rows[0].id
    } catch (error) {
      console.log(error)
      throw new InvariantError('Adding new mail in failed')
    }
  }

  async updateMail(id, payload) {
    try {
      const { nomorBerkas, tanggalMasuk, nomorSurat, perihal, pengantar } = payload
      const updated = true
      const query = {
        text: 'UPDATE surat_masuk SET nomor_berkas = $1, tanggal_masuk = $2, nomor_surat = $3, perihal = $4, pengantar = $5, updated = $6 WHERE id = $7 RETURNING id',
        values: [nomorBerkas, tanggalMasuk, nomorSurat, perihal, pengantar, updated, id]
      }
      const { rows } = await this._pool.query(query)

      return rows[0].id
    } catch (error) {
      throw new InvariantError('Update mail in failed')
    }
  }

  async checkMailAvailability(id) {
    const query = {
      text: 'SELECT id FROM surat_masuk WHERE id = $1',
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
      text: 'DELETE FROM surat_masuk WHERE id = $1',
      values: [id]
    }

    await this._pool.query(query)
  }

  async getMailins(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize
    const query = {
      text: 'SELECT * FROM surat_masuk LIMIT $1 OFFSET $2',
      values: [pageSize, offset]
    }

    const { rows } = await this._pool.query(query)
    return rows
  }

  async getMailinsBySearch(search) {
    const query = {
      text: 'SELECT nomor_berkas, tanggal_masuk, perihal, pengantar FROM surat_masuk WHERE perihal ILIKE $1 OR pengantar ILIKE $1 LIMIT 50',
      values: [`%${search}%`]
    }

    const { rows } = await this._pool.query(query)
    return rows
  }
}

module.exports = MailinService
