const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError.js')
const NotFoundError = require('../exceptions/NotFoundError.js')

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

  async getMailouts(pageNumber = 1, pageSize = 10) {
    const offset = (pageNumber - 1) * pageSize
    const query = {
      text: 'SELECT id, nomor_berkas, alamat_penerima, tanggal_keluar, perihal FROM surat_keluar ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      values: [pageSize, offset]
    }

    const { rows } = await this._pool.query(query)
    return rows
  }

  async getMailoutsTotal() {
    const { rows } = await this._pool.query('SELECT COUNT(*) AS total FROM surat_keluar')
    return rows[0].total
  }

  async getMailoutsSourceFrequency() {
    const { rows } = await this._pool.query('SELECT alamat_penerima AS source, COUNT(*) AS frequency FROM surat_keluar GROUP BY alamat_penerima')
    return rows
  }

  async getMailoutsBySearch(search) {
    const query = {
      text: 'SELECT id, perihal, alamat_penerima FROM surat_keluar WHERE perihal ILIKE $1 OR alamat_penerima ILIKE $1 LIMIT 50',
      values: [`%${search}%`]
    }

    const { rows } = await this._pool.query(query)
    return rows
  }

  async getMailoutDetail(id) {
    const query = {
      text: 'SELECT * FROM surat_keluar WHERE id = $1',
      values: [id]
    }
    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new NotFoundError('Invalid mailout id')
    }

    return rows[0]
  }
}

module.exports = MailoutService
