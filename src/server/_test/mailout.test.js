const AuthHelper = require('../../TestHelpers/AuthHelper.js')
const UserHelpers = require('../../TestHelpers/UserHelpers.js')
const createServer = require('../server.js')
const pool = require('../../TestHelpers/PoolHelper.js')
const MailoutHelper = require('../../TestHelpers/MailoutHelper.js')

describe('mailin', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserHelpers.cleanTable()
    await MailoutHelper.cleanTable()
    await AuthHelper.cleanTable()
  })

  describe('POST /suratkeluar', () => {
    it('should throw error for unauthorized user', async () => {
      await AuthHelper.cleanTable()

      const server = await createServer()
      const payload = {
        nomorBerkas: 'nomorberkas-123',
        alamatPenerima: 'Dinas Kes',
        tanggalKeluar: new Date(),
        perihal: 'Ini surat keluar'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/suratkeluar',
        payload
      })

      expect(response.statusCode).toEqual(401)
    })

    it('should throw error for bad payload', async () => {
      await AuthHelper.cleanTable()

      const server = await createServer()
      await UserHelpers.addUser('mailout_badpayload')
      const token = await AuthHelper.generateToken('user-123')
      const payload = {
        nomorBerkas: 'nomorberkas-123',
        alamatPenerima: 'Dinas Kes',
        tanggalKeluar: new Date(),
        perihal: true
      }

      const response = await server.inject({
        method: 'POST',
        url: '/suratkeluar',
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should store mail correctly and return response', async () => {
      await AuthHelper.cleanTable()

      const server = await createServer()

      await UserHelpers.addUser('store_mailout')
      const token = await AuthHelper.generateToken('user-123')
      const payload = {
        nomorBerkas: 'nomorberkas-123',
        alamatPenerima: 'Dinas Kes',
        tanggalKeluar: new Date(),
        perihal: 'Ini surat keluar'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/suratkeluar',
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
    })
  })

  describe('PUT /suratkeluar/{id}', () => {
    it('should throw error for unauthorized user', async () => {
      const server = await createServer()
      const payload = {
        nomorBerkas: 'nomorberkas-123',
        alamatPenerima: 'Dinas Kes',
        tanggalKeluar: new Date(),
        perihal: true
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/suratkeluar/suratkeluar-123',
        payload
      })

      expect(response.statusCode).toEqual(401)
    })

    it('should throw error for badpayload', async () => {
      const token = await AuthHelper.generateToken('123')
      const server = await createServer()
      const payload = {
        nomorBerkas: 'nomorberkas-123',
        alamatPenerima: 'Dinas Kes',
        tanggalKeluar: new Date(),
        perihal: true
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/suratkeluar/suratkeluar-123',
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
    })

    it('should throw error for invalid mail id', async () => {
      const token = await AuthHelper.generateToken('user-123')
      const server = await createServer()
      const payload = {
        nomorBerkas: 'nomorberkas-123',
        alamatPenerima: 'Dinas Kes',
        tanggalKeluar: new Date(),
        perihal: 'Ini surat keluar'
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/suratkeluar/suratkeluar-123',
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Mail id is not valid')
    })

    it('should update the mail in correctly', async () => {
      await MailoutHelper.addMailout()
      const server = await createServer()
      const token = await AuthHelper.generateToken('user-123')

      //just make sure that mailin is not empty
      const mailinData = await MailoutHelper.getMailouts()
      expect(mailinData.updated).toEqual(false)

      const payload = {
        nomorBerkas: 'nomorberkas-123',
        alamatPenerima: 'Dinas Kes',
        tanggalKeluar: new Date(),
        perihal: 'Ini surat keluar'
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/suratkeluar/suratkeluar-123',
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      //main test
      const mailoutDataUpdated = await MailoutHelper.getMailouts()

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(mailoutDataUpdated.updated).toEqual(true)
    })
  })

  describe('DELETE /suratkeluar/{id}', () => {
    it('should throw error for unauthorized user', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'DELETE',
        url: '/suratkeluar/suratkeluar-123'
      })

      expect(response.statusCode).toEqual(401)
    })

    it('should throw error for invalid mail id', async () => {
      const token = await AuthHelper.generateToken('user-123')
      const server = await createServer()

      const response = await server.inject({
        method: 'DELETE',
        url: '/suratkeluar/suratkeluar-123',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Mail id is not valid')
    })

    it('should delete mail correctly', async () => {
      await MailoutHelper.addMailout()

      //make sure mailout is available
      const mailouts = await MailoutHelper.getMailouts()
      expect(mailouts).toBeTruthy()

      //main test
      const token = await AuthHelper.generateToken('user-123')
      const server = await createServer()

      const response = await server.inject({
        method: 'DELETE',
        url: '/suratkeluar/suratkeluar-123',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)

      const mailoutsAfterDeleted = await MailoutHelper.getMailouts()
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.message).toEqual('Mail out deleted')
      expect(mailoutsAfterDeleted).toBeFalsy()
    })
  })

  describe('GET /suratkeluar', () => {
    it('should send no mail yet message when mailout was empty', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratkeluar'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('No mail out found!')
    })

    it('should send valid response with 10 first mailout', async () => {
      await MailoutHelper.addManyMailouts()
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratkeluar'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.dataLength).toEqual(10)
      expect(responseJson.data).toHaveLength(10)
    })

    it('should send valid response 5 second mailout (page 2)', async () => {
      await MailoutHelper.addManyMailouts()
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratkeluar?page=2&size=10'
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.dataLength).toEqual(5)
      expect(responseJson.data).toHaveLength(5)
    })
  })

  describe('GET /suratkeluar/search?q={q}', () => {
    it('should still return 200 response with empty array data if the was not found', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratkeluar/search?q=app'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveLength(0)
    })

    it('should return list of mails for "app" query', async () => {
      await MailoutHelper.addMailsWithDifferentTitle()
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratkeluar/search?q=app'
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveLength(2)
    })

    it('should return list of mails for "disdik" query', async () => {
      await MailoutHelper.addMailsWithDifferentTitle()
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratkeluar/search?q=disdik'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveLength(3)
    })

    it('should throw error when try to access /suratkeluar/search without q query', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratkeluar/search'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Do not forget the query!')
    })
  })
})
