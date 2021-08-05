const { PostPlaylistPayloadSchema } = require('./schema');

const PlaylistValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
