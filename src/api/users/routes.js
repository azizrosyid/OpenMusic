function routes(handler) {
  return [
    {
      method: 'POST',
      path: '/users',
      handler: handler.postUserHandler,
    },
  ];
}
module.exports = routes;
