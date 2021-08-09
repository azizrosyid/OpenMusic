class UploadsHandler {
  constructor(storageService, songsService, pictureService, validator) {
    this.storageService = storageService;
    this.validator = validator;
    this.songsService = songsService;
    this.pictureService = pictureService;
  }

  postUploadPictureHandler = async (request, h) => {
    const { data, songId } = request.payload;
    let credentialId = null;
    if (request.auth.credentials !== null) {
      credentialId = request.auth.credentials.id;
    }
    await this.validator.validateUploadPayload({
      'content-type': data.hapi.headers['content-type'],
    });
    const fileName = await this.storageService.writeFile(
      data,
      data.hapi.filename,
    );
    const pictureId = await this.pictureService.addPicture(
      `/upload/pictures/${fileName}`,
      credentialId,
    );

    if (songId) {
      await this.songsService.updatePictureId(songId, pictureId);
    }

    return h
      .response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          pictureUrl: `${request.headers.host}/upload/pictures/${fileName}`,
        },
      })
      .code(201);
  };
}
module.exports = UploadsHandler;
