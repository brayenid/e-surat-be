const pool = require('./PoolHelper')
const UserHelpers = require('./UserHelpers')

const MailoutHelper = {
  async addMailout() {
    try {
      await UserHelpers.addUser()
      const payload = {
        id: 'suratkeluar-123',
        nomorBerkas: 'berkas-123',
        alamatPenerima: 'Dinas Kes',
        tanggalKeluar: new Date(),
        perihal: 'Ini adalah surat keluar',
        pengirim: 'user-123'
      }

      const query = {
        text: 'INSERT INTO surat_keluar VALUES($1, $2, $3, $4, $5, $6)',
        values: [payload.id, payload.nomorBerkas, payload.alamatPenerima, payload.tanggalKeluar, payload.perihal, payload.pengirim]
      }

      await pool.query(query)
    } catch (error) {
      console.error(error)
    }
  },
  async getMailouts() {
    const { rows } = await pool.query('SELECT * FROM surat_keluar LIMIT 10')

    return rows[0]
  },
  async cleanTable() {
    await pool.query('DELETE FROM surat_keluar WHERE 1=1')
  }
}

module.exports = MailoutHelper
