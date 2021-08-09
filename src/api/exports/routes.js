function routes(handler) {
  return [
    {
      method: 'POST',
      path: '/exports/playlists/{playlistId}',
      handler: handler.postExportsHandler,
      options: { auth: 'openmusic_jwt' },
    },
  ];
}
module.exports = routes;
