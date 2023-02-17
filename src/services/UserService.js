import pkg from 'pg'
import bcryptPassword from '../utils/bcrypt/index.js'
import { nanoid } from 'nanoid'
import InvariantError from '../exceptions/InvariantError.js'
import AuthenticationError from '../exceptions/AuthenticationError.js'

const { Pool } = pkg

class UserService {
  constructor() {
    this._pool = new Pool()
  }

  async addUser(payload) {
    const { username, fullname, role, password } = payload
    await this._checkUsername(username)
    const id = `user-${nanoid(8)}`
    const hashedPassword = await bcryptPassword.hash(password)
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, username, fullname, role, hashedPassword]
    }

    const { rowCount, rows } = await this._pool.query(query)

    if (!rowCount) {
      throw new InvariantError('Failed to add user')
    }
    return rows[0]
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

export default UserService
