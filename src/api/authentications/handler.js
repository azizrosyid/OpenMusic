const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
  constructor(usersService, authenticationsService, tokenManager, validator) {
    this._usersService = usersService;
    this._authenticationsService = authenticationsService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  postAuthenticationHandler = async (request, h) => {
    try {
      await this._validator.validatePostAuthenticationPayload(request.payload);
      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredentials(username, password);
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);
      return h.response({
        status: 'success',
        message: 'Authentication successful',
        data: {
          accessToken,
          refreshToken,
        },
      }).code(201);
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      return response;
    }
  };

  putAuthenticationHandler = async (request, h) => {
    try {
      await this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.validateRefreshToken(refreshToken);
      const accessToken = this._tokenManager.generateAccessToken({ id });

      const response = h.response({
        status: 'success',
        message: 'Authentication has been successfully refreshed',
        data: {
          accessToken,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      return response;
    }
  }

  deleteAuthenticationHandler = async (request, h) => {
    try {
      await this._validator.validateDeleteAuthenticationPayload(request.payload);
      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);
      return h.response({
        status: 'success',
        message: 'Authentication has been successfully deleted',
      }).code(200);
    } catch (error) {
      console.error(error);
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = AuthenticationsHandler;
