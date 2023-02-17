import pkg from 'pg'
import { nanoid } from 'nanoid'
import InvariantError from '../exceptions/InvariantError.js'
const { Pool } = pkg

class MailinService {
  constructor() {
    this._pool = new Pool()
  }

  async addMail(payload) {
    const { nomorBerkas, tanggalMasuk, nomorSurat, perihal, pengantar, penerima } = payload
    const id = `suratmasuk-${nanoid(8)}`

    const query = {
      text: 'INSERT INTO surat_masuk VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, nomorBerkas, tanggalMasuk, nomorSurat, perihal, pengantar, penerima]
    }

    const { rows, rowCount } = await this._pool.query(query)
    if (!rowCount) {
      throw new InvariantError('Adding new mail in failed')
    }
    return rows[0].id
  }

  async updateMail(id, payload) {
    const { nomorBerkas, tanggalMasuk, nomorSurat, perihal, pengantar } = payload
    const query = {
      text: 'UPDATE surat_masuk SET nomor_berkas = $1, tanggal_masuk = $2, nomor_surat = $3, perihal = $4, pengantar = $5 WHERE id = $6 RETURNING id',
      values: [nomorBerkas, tanggalMasuk, nomorSurat, perihal, pengantar, id]
    }

    const { rowCount, rows } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError('Update mail in failed')
    }
    return rows[0].id
  }

  async deleteMail(id) {
    const query = {
      text: 'DELETE FROM surat_masuk WHERE id = $1',
      values: [id]
    }

    await this._pool.query(query)
  }
}

export default MailinService
