/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('pictures', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    picture_url: { type: 'VARCHAR(255)', notNull: true, unique: true },
    picture_created: { type: 'TIMESTAMP WITH TIME ZONE', notNull: true, default: pgm.func('current_timestamp') },
    picture_created_user_id: { type: 'VARCHAR(50)', notNull: false },
  });

  pgm.addConstraint('pictures', 'pictures_picture_created_user_id_fkey', 'FOREIGN KEY (picture_created_user_id) REFERENCES users(id) ON DELETE SET NULL');
};

exports.down = (pgm) => {
  pgm.dropConstraint('pictures', 'pictures_picture_created_user_id_fkey');
  pgm.dropTable('pictures');
};
