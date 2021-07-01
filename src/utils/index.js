/* eslint-disable camelcase */
const mapDBToModel = (data) => {
  const { inserted_at, updated_at } = data;

  return { ...data, insertedAt: inserted_at, updatedAt: updated_at };
};

module.exports = { mapDBToModel };
