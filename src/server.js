/* eslint-disable no-console */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// plugin songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/songs');

// plugin users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UserValidator = require('./validator/users');

// plugin authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const tokenManager = require('./tokenize/TokenManager');
const authenticationValidator = require('./validator/authentications');

// plugin playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const playlistValidator = require('./validator/playlists');

const start = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(Jwt);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_MAX_AGE_SECONDS,
    },
    validate: (artifact) => ({
      isValid: true,
      credentials: { id: artifact.decoded.payload.id },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager,
        validator: authenticationValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: playlistValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

start();
