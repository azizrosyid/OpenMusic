const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  addCollaboration= async ({ playlistId, userId }) => {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations (id, playlist_id, user_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Collaboration not added');
    }
    return result.rows[0].id;
  }

  deleteCollaboration = async ({ playlistId, userId }) => {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Collaboration not deleted');
    }
  }

  verifyCollaborator = async (playlistId, userId) => {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new AuthorizationError('You are not authorized to access this playlist.');
    }
  }
}
module.exports = CollaborationsService;
