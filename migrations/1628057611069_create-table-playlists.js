/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    name: { type: 'TEXT', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true },
  });

  pgm.addConstraint('playlists', 'unique_playlists', 'UNIQUE (owner, name)');
  pgm.addConstraint('playlists', 'fk_playlist.owner_user.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlist.owner_user.id');
  pgm.dropConstraint('playlists', 'unique_playlists');
  pgm.dropTable('playlists');
};
