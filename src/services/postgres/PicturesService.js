const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PicturesService {
  constructor() {
    this.pool = new Pool();
  }

  async addPicture(pictureUrl, userId) {
    const id = `picture-${nanoid(16)}`;
    const pictureCreated = new Date();
    const query = {
      text: 'INSERT INTO pictures (id, picture_url, picture_created, picture_created_user_id) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, pictureUrl, pictureCreated, userId],
    };

    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Could not add picture to database');
    }

    return result.rows[0].id;
  }
}

module.exports = PicturesService;
