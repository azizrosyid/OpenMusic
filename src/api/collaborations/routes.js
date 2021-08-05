function routes(handler) {
  return [
    // Method: POST
    // URL: /collaborations
    {
      method: 'POST',
      path: '/collaborations',
      handler: handler.postCollaborationHandler,
      options: { auth: 'openmusic_jwt' },

    },
    // Method: DELETE
    // URL: /collaborations
    {
      method: 'DELETE',
      path: '/collaborations',
      handler: handler.deleteCollaborationHandler,
      options: { auth: 'openmusic_jwt' },
    },
  ];
}
module.exports = routes;
