const pool = require('./PoolHelper')
const TokenManager = require('../utils/token/index.js')

const AuthHelper = {
  async generateToken(id) {
    const accessToken = TokenManager.generateAccessToken({ id })

    return accessToken
  },
  async addTokenToDb(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token]
    }

    await pool.query(query)
  },
  async findToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token]
    }

    const result = await pool.query(query)

    return result.rows
  },
  async cleanTable() {
    await pool.query('DELETE FROM authentications WHERE 1=1')
  }
}

module.exports = AuthHelper
