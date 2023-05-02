const bcrypt = require('bcrypt')

const bcryptPassword = {
  hash: async (password) => {
    const hashed = await bcrypt.hash(password, 10)
    return hashed
  },
  compare: async (password, hashedPassword) => {
    const result = await bcrypt.compare(password, hashedPassword)
    return result
  }
}

module.exports = bcryptPassword
