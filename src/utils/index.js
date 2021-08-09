/* eslint-disable camelcase */
const mapDBToModel = (data) => {
  const {
    inserted_at, updated_at, picture_url, picture_id, ...rest
  } = data;

  const result = { ...rest, insertedAt: inserted_at, updatedAt: updated_at };
  if (picture_url) {
    result.pictureUrl = `http://${process.env.HOST}:${process.env.PORT}${picture_url}`;
  }

  return result;
};

module.exports = { mapDBToModel };
