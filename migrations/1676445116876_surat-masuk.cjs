/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('surat_masuk', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    nomor_berkas: {
      type: 'TEXT',
      default: null
    },
    tanggal_masuk: {
      type: 'TEXT',
      notNull: true
    },
    nomor_surat: {
      type: 'TEXT',
      notNull: true
    },
    perihal: {
      type: 'TEXT',
      notNull: true
    },
    pengantar: {
      type: 'TEXT',
      default: 'Staff'
    },
    penerima: {
      type: 'VARCHAR(30)',
      notNull: true
    },
    updated: {
      type: 'BOOLEAN',
      default: false
    },
    created_at: {
      type: 'TIMESTAMP WITH TIME ZONE',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
  pgm.addConstraint('surat_masuk', 'fk_surat_masuk.penerima_users.id', 'FOREIGN KEY(penerima) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropTable('surat_masuk')
}
