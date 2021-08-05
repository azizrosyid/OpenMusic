const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  addPlaylist = async ({ name, owner }) => {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    try {
      const result = await this._pool.query(query);
      if (result.rows.length === 0) {
        throw new InvariantError(`Playlist ${name} could not be created`);
      }
      return result.rows[0].id;
    } catch (error) {
      if (error.message.includes('duplicate key value violates unique constraint')) {
        throw new InvariantError(`Playlist duplicate name ${name}`);
      }
      throw error;
    }
  };

  getPlaylistsByOwner = async (owner) => {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists INNER JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1',
      values: [owner],
    };

    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError(`Playlists for user ${owner} could not be found`);
    }
    return result.rows;
  };

  deletePlaylist = async (owner, playlistId) => {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new AuthorizationError(`Playlist ${playlistId} could not be deleted`);
    }
  }
}

module.exports = PlaylistsService;
