const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  addRefreshToken = async (refreshToken) => {
    const query = {
      text: 'INSERT INTO authentications (token) VALUES ($1) RETURNING token',
      values: [refreshToken],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Unable to add refresh token');
    }
    return result.rows[0].token;
  };

  // verify a refresh token
  verifyRefreshToken = async (refreshToken) => {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [refreshToken],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Invalid refresh token');
    }
  };

  deleteRefreshToken = async (refreshToken) => {
    await this.verifyRefreshToken(refreshToken);
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };
    const result = await this._pool.query(query);
    if (result.rowCount === 0) {
      throw new InvariantError('Invalid refresh token');
    }
  };
}

module.exports = AuthenticationsService;
