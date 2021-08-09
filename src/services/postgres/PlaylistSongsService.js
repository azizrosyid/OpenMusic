const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  addSongToPlaylist = async (playlistId, songId) => {
    const id = `playlistSong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs (id, playlist_id, song_id) VALUES ($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    let result;
    try {
      result = await this.pool.query(query);
    } catch (error) {
      throw new InvariantError('song id not found');
    }
    if (result.rowCount === 0) {
      throw new InvariantError('Could not add song to playlist');
    }
    await this.cacheService.delete(`playlistSong-${playlistId}`);
  };

  getAllSongFromPlaylist = async (playlistId, creadentialId) => {
    try {
      const result = await this.cacheService.get(`playlistSong-${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs 
            JOIN playlists ON playlistsongs.playlist_id = playlists.id 
            LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
            JOIN songs ON playlistsongs.song_id = songs.id
            WHERE playlists.id = $1 AND (playlists.owner = $2 OR collaborations.user_id = $2)`,
        values: [playlistId, creadentialId],
      };
      const result = await this.pool.query(query);
      if (result.rowCount === 0) {
        throw new NotFoundError(
          `Could not find playlist with id ${playlistId}`,
        );
      }
      await this.cacheService.set(
        `playlistSong-${playlistId}`,
        JSON.stringify(result.rows),
      );
      return result.rows;
    }
  };

  deleteSongFromPlaylist = async (playlistId, songId) => {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Could not delete song from playlist');
    }
    await this.cacheService.delete(`playlistSong-${playlistId}`);
  };
}

module.exports = PlaylistSongsService;
