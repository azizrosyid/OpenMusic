/* eslint-disable no-console */
const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
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

  postCollaborationHandler = async (request, h) => {
    try {
      await this._validator.validatePostCollaborationPayload(request.payload);
      const credentialId = request.auth.credentials.id;

      const { playlistId, userId } = request.payload;
      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId,
      );
      const id = await this._collaborationsService.addCollaboration({ playlistId, userId });
      return h
        .response({
          status: 'success',
          message: 'Collaboration added',
          data: { collaborationId: id },
        })
        .code(201);
    } catch (error) {
      return this.handleError(h, error);
    }
  };

  deleteCollaborationHandler = async (request, h) => {
    try {
      await this._validator.validateDeleteCollaborationPayload(request.payload);
      const credentialId = request.auth.credentials.id;
      const { playlistId, userId } = request.payload;
      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId,
      );

      await this._collaborationsService.deleteCollaboration({ playlistId, userId });
      return h.response({
        status: 'success',
        message: 'Collaboration deleted',
      });
    } catch (error) {
      return this.handleError(h, error);
    }
  }
}
module.exports = CollaborationsHandler;
