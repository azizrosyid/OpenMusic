function routes(handler) {
  return [
    // Method : POST
    // URL : /playlists/{playlistId}/songs
    {
      method: 'POST',
      path: '/playlists/{playlistId}/songs',
      handler: handler.postPlaylistSongsHandler,
      options: { auth: 'openmusic_jwt' },
    },
    // Method : GET
    // URL : /playlists/{playlistId}/songs
    {
      method: 'GET',
      path: '/playlists/{playlistId}/songs',
      handler: handler.getPlaylistSongsHandler,
      options: { auth: 'openmusic_jwt' },
    },
    // Method : DELETE
    // URL : /playlists/{playlistId}/songs
    {
      method: 'DELETE',
      path: '/playlists/{playlistId}/songs',
      handler: handler.deletePlaylistSongsHandler,
      options: { auth: 'openmusic_jwt' },
    },
  ];
}

module.exports = routes;
