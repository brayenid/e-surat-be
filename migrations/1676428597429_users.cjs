exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    username: {
      type: 'TEXT',
      unique: true,
      notNull: true
    },
    fullname: {
      type: 'TEXT',
      notNull: true
    },
    role: {
      type: 'TEXT',
      default: 'Agendaris Transmigrasi'
    },
    password: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('users')
}
