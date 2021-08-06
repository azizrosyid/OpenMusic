class PlaylistSongsHandler {
  constructor(PlaylistSongsService, PlaylistsService, validator) {
    this._playlistSongsService = PlaylistSongsService;
    this._playlistsService = PlaylistsService;
    this._validator = validator;
  }

  postPlaylistSongsHandler = async (request, h) => {
    await this._validator.validatePostPlaylistSongPayload(request.payload);
    const credentialId = request.auth.credentials.id;
    const { songId } = request.payload;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId,
    );
    await this._playlistSongsService.addSongToPlaylist(playlistId, songId);
    return h.response({
      status: 'success',
      message: 'Song added to playlist',
    }).code(201);
  };

  getPlaylistSongsHandler = async (request, h) => {
    const credentialId = request.auth.credentials.id;
    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId,
    );
    const songs = await this._playlistSongsService.getAllSongFromPlaylist(
      playlistId,
      credentialId,
    );
    return h.response({
      status: 'success',
      data: { songs },
    });
  };

  deletePlaylistSongsHandler = async (request, h) => {
    await this._validator.validateDeletePlaylistSongPayload(request.payload);
    const credentialId = request.auth.credentials.id;
    const { playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(
      playlistId,
      credentialId,
    );
    await this._playlistSongsService.deleteSongFromPlaylist(
      playlistId,
      songId,
    );
    return h.response({
      status: 'success',
      message: 'Song deleted from playlist',
    });
  };
}
module.exports = PlaylistSongsHandler;
