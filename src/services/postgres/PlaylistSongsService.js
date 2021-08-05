const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this.pool = new Pool();
  }

  addSongToPlaylist = async (playlistId, songId) => {
    const id = `playlistSong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs (id, playlist_id, song_id) VALUES ($1, $2, $3) ',
      values: [id, playlistId, songId],
    };

    try {
      const result = await this.pool.query(query);
      if (result.rowCount === 0) {
        throw new InvariantError('Could not add song to playlist');
      }
    } catch (error) {
      throw new InvariantError('song id not found');
    }
  };

  getAllSongFromPlaylist = async (playlistId, creadentialId) => {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs 
          JOIN playlists ON playlistsongs.playlist_id = playlists.id 
          JOIN songs ON playlistsongs.song_id = songs.id
          WHERE playlists.id = $1 AND playlists.owner = $2`,
      values: [playlistId, creadentialId],
    };
    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new NotFoundError(`Could not find playlist with id ${playlistId}`);
    }
    return result.rows;
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
  };
}

module.exports = PlaylistSongsService;
