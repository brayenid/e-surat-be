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
      type: 'timestamp',
      notNull: true
    },
    perihal: {
      type: 'TEXT',
      notNull: true
    },
    pengirim: {
      type: 'VARCHAR(30)',
      notNull: true
    }
  })
  pgm.addConstraint('surat_keluar', 'fk_surat_keluar.pengirim_users.id', 'FOREIGN KEY (pengirim) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  pgm.dropTable('surat_keluar')
}
