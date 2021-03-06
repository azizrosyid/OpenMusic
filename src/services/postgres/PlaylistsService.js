const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  verifyPlaylistOwner = async (playlistId, owner) => {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, owner],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new AuthorizationError(
        `The playlist with id ${playlistId} is not owned by ${owner}`,
      );
    }
  };

  verifyPlaylistAccess = async (playlistId, owner) => {
    try {
      await this.verifyPlaylistOwner(playlistId, owner);
    } catch (error) {
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, owner);
      } catch {
        throw error;
      }
    }
  };

  addPlaylist = async ({ name, owner }) => {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id, owner',
      values: [id, name, owner],
    };

    try {
      const result = await this._pool.query(query);
      if (result.rows.length === 0) {
        throw new InvariantError(`Playlist ${name} could not be created`);
      }
      await this._cacheService.delete(`playlist-${owner}`);
      return result.rows[0].id;
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        throw new InvariantError(`Playlist duplicate name ${name}`);
      }
      throw error;
    }
  };

  getPlaylistsByOwner = async (owner) => {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists JOIN users ON playlists.owner = users.id 
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    await this._cacheService.set(`playlist-${owner}`, JSON.stringify(result.rows));
    return result.rows;
  };

  deletePlaylist = async (owner, playlistId) => {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2',
      values: [playlistId, owner],
    };

    await this._cacheService.delete(`playlist-${owner}`);
    await this._cacheService.delete(`playlistSong-${playlistId}`);

    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new AuthorizationError(
        `Playlist ${playlistId} could not be deleted`,
      );
    }
  };
}

module.exports = PlaylistsService;
