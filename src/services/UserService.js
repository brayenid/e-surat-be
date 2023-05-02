const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError.js')
const AuthenticationError = require('../exceptions/AuthenticationError.js')
const bcryptPassword = require('../utils/bcrypt/index.js')

class UserService {
  constructor() {
    this._pool = new Pool()
  }

  async addUser(payload) {
    try {
      const { username, fullname, role, password } = payload
      await this._checkUsername(username)
      const id = `user-${nanoid(8)}`
      const hashedPassword = await bcryptPassword.hash(password)
      const query = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, username, fullname, role, hashedPassword]
      }

      const { rows } = await this._pool.query(query)
      return rows[0]
    } catch (error) {
      console.error(error)
      throw new InvariantError('Failed to add user')
    }
  }

  async _checkUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }
    const { rowCount } = await this._pool.query(query)
    if (rowCount) {
      throw new InvariantError('Username already taken')
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username]
    }
    const { rowCount, rows } = await this._pool.query(query)
    if (!rowCount) {
      throw new AuthenticationError('Invalid credential')
    }

    const { id, password: hashedPassword } = rows[0]
    const isMatched = await bcryptPassword.compare(password, hashedPassword)
    if (!isMatched) {
      throw new InvariantError('Wrong password')
    }
    return id
  }
}

module.exports = UserService
