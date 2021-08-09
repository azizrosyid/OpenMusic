/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('songs', {
    picture_id: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });

  pgm.addConstraint('songs', 'fk_songs.picture_id_pictures.id', 'FOREIGN KEY(picture_id) REFERENCES pictures(id) ON DELETE SET NULL');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.picture_id_pictures.id');
  pgm.dropColumn('songs', 'picture_id');
};
