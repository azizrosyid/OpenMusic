class ExportsHandler {
  constructor(exportsService, playlistsService, validator) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  postExportsHandler = async (request, h) => {
    this._validator.validateExportNotesPayload(request.payload);
    const { playlistId } = request.params;
    const userId = request.auth.credentials.id;
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const message = {
      userId,
      targetEmail: request.payload.targetEmail,
      playlistId,
    };

    await this._exportsService.sendMessage('export:playlist', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
