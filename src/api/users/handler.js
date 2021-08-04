const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postUserHandler = async (request, h) => {
    try {
      // validate the request
      await this._validator.validateUserPayload(request.payload);
      // create the user
      const userId = await this._service.addUser(request.payload);
      // return the user
      const response = h.response({
        status: 'success',
        message: 'User created',
        data: { userId },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // response with server error
      const response = h.response({
        status: 'error',
        message: 'Internal server error',
      });
      response.code(500);
      return response;
    }
  };
}

module.exports = UsersHandler;
