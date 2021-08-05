const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

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

    const result = await this.pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Could not add song to playlist');
    }
  }
}

module.exports = PlaylistSongsService;
