function routes(handler) {
  return [
    // Method : POST
    // URL : /playlists
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.postPlaylistHandler,
      options: { auth: 'openmusic_jwt' },
    },
    // Method : GET
    // URL : /playlists
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getPlaylistsHandler,
      options: { auth: 'openmusic_jwt' },
    },
    // Method : DELETE
    // URL : /playlists/{playlistId}
    {
      method: 'DELETE',
      path: '/playlists/{playlistId}',
      handler: handler.deletePlaylistHandler,
      options: { auth: 'openmusic_jwt' },
    },
  ];
}

module.exports = routes;
