/* eslint-disable no-console */
const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(PlaylistSongsService, PlaylistsService, validator) {
    this._playlistSongsService = PlaylistSongsService;
    this._playlistsService = PlaylistsService;
    this._validator = validator;
  }

  handleError = (h, error) => {
    if (error instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Internal Server Error!',
    });
    response.code(500);
    return response;
  };

  postPlaylistSongsHandler = async (request, h) => {
    try {
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
    } catch (error) {
      return this.handleError(h, error);
    }
  };

  getPlaylistSongsHandler = async (request, h) => {
    try {
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
    } catch (error) {
      return this.handleError(h, error);
    }
  };

  deletePlaylistSongsHandler = async (request, h) => {
    try {
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
    } catch (error) {
      return this.handleError(h, error);
    }
  };
}
module.exports = PlaylistSongsHandler;
