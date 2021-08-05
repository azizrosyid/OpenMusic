/* eslint-disable no-console */
const ClientError = require('../../exceptions/ClientError');

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postPlaylistHandler = async (request, h) => {
    try {
      await this._validator.validatePostPlaylistPayload(request.payload);
      const creadentialId = request.auth.credentials.id;
      const playlistName = request.payload.name;

      const playlistId = await this._service.addPlaylist({
        name: playlistName,
        owner: creadentialId,
      });

      return h
        .response({
          status: 'success',
          message: 'Playlist created successfully',
          data: {
            playlistId,
          },
        })
        .code(201);
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      return response;
    }
  };

  getPlaylistsHandler = async (request, h) => {
    try {
      const ownerId = request.auth.credentials.id;
      const playlists = await this._service.getPlaylistsByOwner(ownerId);

      return h.response({
        status: 'success',
        data: {
          playlists,
        },
      });
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      return response;
    }
  };

  deletePlaylistHandler = async (request, h) => {
    try {
      const credentialId = request.auth.credentials.id;
      const { playlistId } = request.params;
      await this._service.deletePlaylist(credentialId, playlistId);
      return h.response({
        status: 'success',
        message: 'Playlist deleted successfully',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      return response;
    }
  };
}

module.exports = PlaylistsHandler;
