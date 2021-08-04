const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, {
    key: process.env.ACCESS_TOKEN_KEY,
  }),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, {
    key: process.env.REFRESH_TOKEN_KEY,
  }),
  validateRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verify(artifacts, {
        algorithm: artifacts.decoded.header.alg,
        key: process.env.REFRESH_TOKEN_KEY,
      });
      return artifacts.decoded.payload;
    } catch (error) {
      throw new InvariantError('Refresh token is invalid');
    }
  },
};

module.exports = TokenManager;
