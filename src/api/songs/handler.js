const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-console */
class SongsHandler {
  constructor(service, validator) {
    this._service = service;
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
  }

  postSongHandler = async (request, h) => {
    try {
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
    } catch (error) {
      return this.handleError(h, error);
    }
  };

  getSongsHandler = async (request, h) => {
    const songsTotal = await this._service.getSongs();
    // send only id, title, performer
    const songs = songsTotal.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

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
    try {
      const { songId } = request.params;
      const song = await this._service.getSongById(songId);

      const response = h.response({
        status: 'success',
        data: {
          song,
        },
      });
      return response;
    } catch (error) {
      return this.handleError(h, error);
    }
  };

  putSongByIdHandler = async (request, h) => {
    try {
      const { songId } = request.params;

      this._validator.validateSongPayload(request.payload);
      await this._service.editSongById(songId, request.payload);

      const response = h.response({
        status: 'success',
        message: 'lagu berhasil diperbarui',
      });
      response.code(200);
      return response;
    } catch (error) {
      return this.handleError(h, error);
    }
  }

  deleteSongByIdHandler = async (request, h) => {
    try {
      const { songId } = request.params;
      await this._service.deleteSongById(songId);

      const response = h.response({
        status: 'success',
        message: 'lagu berhasil dihapus',

      });
      response.code(200);
      return response;
    } catch (error) {
      return this.handleError(h, error);
    }
  }
}

module.exports = SongsHandler;
