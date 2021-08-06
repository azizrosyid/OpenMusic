class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postPlaylistHandler = async (request, h) => {
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
  };

  getPlaylistsHandler = async (request, h) => {
    const ownerId = request.auth.credentials.id;
    const playlists = await this._service.getPlaylistsByOwner(ownerId);

    return h.response({
      status: 'success',
      data: {
        playlists,
      },
    });
  };

  deletePlaylistHandler = async (request, h) => {
    const credentialId = request.auth.credentials.id;
    const { playlistId } = request.params;
    await this._service.deletePlaylist(credentialId, playlistId);
    return h.response({
      status: 'success',
      message: 'Playlist deleted successfully',
    });
  };
}

module.exports = PlaylistsHandler;
