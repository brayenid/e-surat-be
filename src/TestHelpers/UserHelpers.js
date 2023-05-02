const bcryptPassword = require('../utils/bcrypt/index')
const pool = require('./PoolHelper')

const UserHelpers = {
  async addUser(functionName = 'undefinedFunc') {
    try {
      const hashedPassword = await bcryptPassword.hash('123')

      const payload = {
        id: 'user-123',
        username: 'brayenid',
        fullname: 'brayenl',
        role: 'agenda',
        password: hashedPassword
      }
      const { id, username, fullname, role, password } = payload
      const query = {
        text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
        values: [id, username, fullname, role, password]
      }

      const { rows } = await pool.query(query)

      return rows[0]
    } catch (error) {
      console.error(functionName + ' : ' + error)
    }
  },
  async checkUsers() {
    const query = await pool.query('SELECT * FROM users')
    return query
  },
  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1')
  }
}

module.exports = UserHelpers
