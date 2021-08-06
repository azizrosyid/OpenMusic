class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postUserHandler = async (request, h) => {
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
  };
}

module.exports = UsersHandler;
