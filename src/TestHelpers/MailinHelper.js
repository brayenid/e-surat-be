const pool = require('./PoolHelper')
const UserHelpers = require('./UserHelpers')

const MailinHelper = {
  async addMailin() {
    try {
      await UserHelpers.addUser()
      const payload = {
        id: 'suratmasuk-123',
        nomorBerkas: 'berkas-123',
        tanggalMasuk: new Date(),
        nomorSurat: 'surat-123',
        perihal: 'Ini adalah surat',
        pengantar: 'orang',
        penerima: 'user-123'
      }

      const query = {
        text: 'INSERT INTO surat_masuk VALUES($1, $2, $3, $4, $5, $6, $7)',
        values: [payload.id, payload.nomorBerkas, payload.tanggalMasuk, payload.nomorSurat, payload.perihal, payload.pengantar, payload.penerima]
      }

      await pool.query(query)
    } catch (error) {
      console.error(error)
    }
  },
  async getMailins() {
    const { rows } = await pool.query('SELECT * FROM surat_masuk LIMIT 10')

    return rows[0]
  },
  async cleanTable() {
    await pool.query('DELETE FROM surat_masuk WHERE 1=1')
  }
}

module.exports = MailinHelper
