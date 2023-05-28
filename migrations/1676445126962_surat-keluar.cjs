exports.up = (pgm) => {
  pgm.createTable('surat_keluar', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    nomor_berkas: {
      type: 'TEXT',
      default: true
    },
    alamat_penerima: {
      type: 'TEXT',
      notNull: true
    },
    tanggal_keluar: {
      type: 'TEXT',
      notNull: true
    },
    perihal: {
      type: 'TEXT',
      notNull: true
    },
    pengirim: {
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
  pgm.addConstraint('surat_keluar', 'fk_surat_keluar.pengirim_users.id', 'FOREIGN KEY (pengirim) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropTable('surat_keluar')
}
