const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-console */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postSongHandler = async (request, h) => {
    this._validator.validateSongPayload(request.payload);
    const {
      title, year, performer, genre, duration,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
    });

    const response = h.response({
      status: 'success',
      message: 'Song successfully added!',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  };

  getSongsHandler = async (request, h) => {
    const songs = await this._service.getSongs();

    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  };

  getSongByIdHandler = async (request, h) => {
    const { songId } = request.params;
    const song = await this._service.getSongById(songId);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    return response;
  };

  putSongByIdHandler = async (request, h) => {
    const { songId } = request.params;

    this._validator.validateSongPayload(request.payload);
    await this._service.editSongById(songId, request.payload);

    const response = h.response({
      status: 'success',
      message: 'lagu berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  deleteSongByIdHandler = async (request, h) => {
    const { songId } = request.params;
    await this._service.deleteSongById(songId);

    const response = h.response({
      status: 'success',
      message: 'lagu berhasil dihapus',

    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
