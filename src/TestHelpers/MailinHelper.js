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
  async addManyMailins(mails = 15) {
    await UserHelpers.addUser()
    const pengantar = ['dinkes', 'dinsos', 'disdik', 'dinsos', 'disnaker', 'disnaker', 'dpmpk', 'dpmpk', 'dinsos', 'dpmpk', 'disdik', 'dinkes', 'disdik', 'dinsos', 'dinsos']
    for (let i = 0; i < mails; i++) {
      try {
        const payload = {
          id: `suratmasuk-12${i}`,
          nomorBerkas: `berkas-12${i}`,
          tanggalMasuk: `202${i}`,
          nomorSurat: `surat-12${i}`,
          perihal: `Ini adalah surat ${i}`,
          pengantar: pengantar[i],
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
    }
  },
  async addMailsWithDifferentTitle(mails = ['apple', 'application', 'orange', 'organization', 'zelda', 'zebra']) {
    await UserHelpers.addUser()
    const dinas = ['dinkes', 'dinsos', 'disdik', 'dispora', 'disdik', 'disdik']
    for (let i = 0; i < mails.length; i++) {
      const mail = mails[i]
      try {
        const payload = {
          id: `suratmasuk-12${i}`,
          nomorBerkas: `berkas-12${i}`,
          tanggalMasuk: `202${i}`,
          nomorSurat: `surat-12${i}`,
          perihal: mail,
          pengantar: dinas[i],
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
    }
  },
  async getMailins() {
    const { rows } = await pool.query('SELECT * FROM surat_masuk LIMIT 10')

    return rows
  },
  async cleanTable() {
    await pool.query('DELETE FROM surat_masuk WHERE 1=1')
  }
}

module.exports = MailinHelper
