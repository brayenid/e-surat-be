const AuthHelper = require('../../TestHelpers/AuthHelper.js')
const UserHelpers = require('../../TestHelpers/UserHelpers.js')
const createServer = require('../server.js')
const pool = require('../../TestHelpers/PoolHelper.js')
const MailinHelper = require('../../TestHelpers/MailinHelper.js')

describe('mailin', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await UserHelpers.cleanTable()
    await MailinHelper.cleanTable()
    await AuthHelper.cleanTable()
  })

  describe('POST /suratmasuk', () => {
    it('should throw error for unauthorized user', async () => {
      await AuthHelper.cleanTable()

      const server = await createServer()
      const payload = {
        nomorBerkas: '1234',
        tanggalMasuk: '2018394de3',
        nomorSurat: 'mockedNomorSurat',
        perihal: 'Undangan Rapat',
        pengantar: 'John Doe'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/suratmasuk',
        payload
      })

      expect(response.statusCode).toEqual(401)
    })

    it('should throw error for bad payload', async () => {
      await AuthHelper.cleanTable()

      const server = await createServer()
      await UserHelpers.addUser('mailin_badpayload')
      const token = await AuthHelper.generateToken('user-123')
      const payload = {
        nomorBerkas: '1234',
        tanggalMasuk: '2018394de3',
        nomorSurat: 'mockedNomorSurat',
        perihal: 'Undangan Rapat',
        pengantar: true
      }

      const response = await server.inject({
        method: 'POST',
        url: '/suratmasuk',
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

      await UserHelpers.addUser('store_mailin')
      const token = await AuthHelper.generateToken('user-123')
      const payload = {
        nomorBerkas: '1234',
        tanggalMasuk: new Date(),
        nomorSurat: 'mockedNomorSurat',
        perihal: 'Undangan Rapat',
        pengantar: 'Orang'
      }

      const response = await server.inject({
        method: 'POST',
        url: '/suratmasuk',
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

  describe('PUT /suratmasuk/{id}', () => {
    it('should throw error for unauthorized user', async () => {
      const server = await createServer()
      const payload = {
        nomorBerkas: 'nomorberkas-123',
        tanggalMasuk: '4Mei2023',
        nomorSurat: 'nomorsurat-123',
        perihal: 'Anntar undangan',
        pengantar: true
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/suratmasuk/suratmasuk-123',
        payload
      })

      expect(response.statusCode).toEqual(401)
    })

    it('should throw error for badpayload', async () => {
      const token = await AuthHelper.generateToken('123')
      const server = await createServer()
      const payload = {
        nomorBerkas: 'nomorberkas-123',
        tanggalMasuk: '4Mei2023',
        nomorSurat: 'nomorsurat-123',
        perihal: 'Anntar undangan',
        pengantar: true
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/suratmasuk/suratmasuk-123',
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
        tanggalMasuk: '4Mei2023',
        nomorSurat: 'nomorsurat-123',
        perihal: 'Anntar undangan',
        pengantar: 'Jamiran'
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/suratmasuk/suratmasuk-123',
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
      await MailinHelper.addMailin()
      const server = await createServer()
      const token = await AuthHelper.generateToken('user-123')

      //just make sure that mailin is not empty
      const mailinData = await MailinHelper.getMailins()
      expect(mailinData[0].updated).toEqual(false)

      const payload = {
        nomorBerkas: 'nomorberkas-124',
        tanggalMasuk: '5 Mei 2022',
        nomorSurat: 'nomorsurat-123',
        perihal: 'Surat ini berubah',
        pengantar: 'Jamiran'
      }

      const response = await server.inject({
        method: 'PUT',
        url: '/suratmasuk/suratmasuk-123',
        payload,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)
      //main test
      const mailinDataUpdated = await MailinHelper.getMailins()

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(mailinDataUpdated[0].updated).toEqual(true)
    })
  })

  describe('DELETE /suratmasuk/{id}', () => {
    it('should throw error for unauthorized user', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'DELETE',
        url: '/suratmasuk/suratmasuk-123'
      })

      expect(response.statusCode).toEqual(401)
    })

    it('should throw error for invalid mail id', async () => {
      const token = await AuthHelper.generateToken('user-123')
      const server = await createServer()

      const response = await server.inject({
        method: 'DELETE',
        url: '/suratmasuk/suratmasuk-123',
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
      await MailinHelper.addMailin()

      //make sure mailout is available
      const mailins = await MailinHelper.getMailins()
      expect(mailins[0]).toBeTruthy()

      //main test
      const token = await AuthHelper.generateToken('user-123')
      const server = await createServer()

      const response = await server.inject({
        method: 'DELETE',
        url: '/suratmasuk/suratmasuk-123',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseJson = JSON.parse(response.payload)

      const mailinsAfterDeleted = await MailinHelper.getMailins()
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.message).toEqual('Mail in deleted')
      expect(mailinsAfterDeleted[0]).toBeFalsy()
    })
  })

  describe('GET /suratmasuk', () => {
    it('should send the response, no matter if its 0, just say "ok"', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratmasuk'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveLength(0)
    })

    it('should send valid response with 10 first mailin', async () => {
      await MailinHelper.addManyMailins()
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratmasuk'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.dataLength).toEqual(10)
      expect(responseJson.data).toHaveLength(10)
    })

    it('should send valid response 5 second mailin (page 2)', async () => {
      await MailinHelper.addManyMailins()
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratmasuk?page=2&size=10'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.dataLength).toEqual(5)
      expect(responseJson.data).toHaveLength(5)
    })
  })

  describe('GET /suratmasuk/search?q={q}', () => {
    it('should still return 200 response with empty array data if the was not found', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratmasuk/search?q=app&by=perihal'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveLength(0)
    })

    it('should return list of mails for "app" query', async () => {
      await MailinHelper.addMailsWithDifferentTitle()
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratmasuk/search?q=app'
      })
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveLength(2)
    })

    it('should return list of mails for "disdik" query', async () => {
      await MailinHelper.addMailsWithDifferentTitle()
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratmasuk/search?q=disdik'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toHaveLength(3)
    })

    it('should throw error when try to access /suratmasuk/search without q query', async () => {
      const server = await createServer()
      const response = await server.inject({
        method: 'GET',
        url: '/suratmasuk/search'
      })
      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Do not forget the query!')
    })
  })
})
