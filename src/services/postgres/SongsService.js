const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class SongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSong({
    title, year, performer, genre, duration,
  }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Failed add songs to database.');
    }

    await this._cacheService.delete('songsAll');

    return result.rows[0].id;
  }

  async getSongs() {
    try {
      const result = await this._cacheService.get('songsAll');
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer,pictures.picture_url FROM songs
              LEFT JOIN pictures ON songs.picture_id = pictures.id`,
      };

      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToModel);
      await this._cacheService.set('songsAll', JSON.stringify(mappedResult));
      return mappedResult;
    }
  }

  async getSongById(id) {
    const query = {
      text: `SELECT song.*, pictures.picture_url 
          FROM (SELECT * FROM songs WHERE id= $1) AS song 
          LEFT JOIN pictures ON song.picture_id = pictures.id`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Id Song Not Found!');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Id Song Not Found!');
    }
    (await this.getAllPlaylistIdBySongId(id)).forEach(
      async (playlistId) => this._cacheService.delete(`playlistSong-${playlistId}`),
    );
    await this._cacheService.delete('songsAll');
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Id Song Not Found!');
    }
    (await this.getAllPlaylistIdBySongId(id)).forEach(
      async (playlistId) => this._cacheService.delete(`playlistSong-${playlistId}`),
    );
    await this._cacheService.delete('songsAll');
  }

  async updatePictureId(id, pictureId) {
    const query = {
      text: 'UPDATE songs SET picture_id = $1 WHERE id = $2 RETURNING id',
      values: [pictureId, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Id Song Not Found!');
    }
    (await this.getAllPlaylistIdBySongId(id)).forEach(
      async (playlistId) => this._cacheService.delete(`playlistSong-${playlistId}`),
    );
    await this._cacheService.delete('songsAll');
  }

  async getAllPlaylistIdBySongId(songId) {
    const query = {
      text: 'SELECT playlist_id FROM playlistsongs WHERE song_id=$1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}
module.exports = SongsService;
