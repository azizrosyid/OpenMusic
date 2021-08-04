function routes(handler) {
  return [
    {
      method: 'POST',
      path: '/authentications',
      handler: handler.postAuthenticationHandler,
    },
    {
      method: 'PUT',
      path: '/authentications',
      handler: handler.putAuthenticationHandler,
    },
    {
      method: 'DELETE',
      path: '/authentications',
      handler: handler.deleteAuthenticationHandler,
    },
  ];
}

module.exports = routes;
