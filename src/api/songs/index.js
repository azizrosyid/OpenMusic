const SongsHandler = require('./handler');
const routes = require('./routes');

exports.plugin = {
  name: 'songs',
  version: '1.0.0',
  async register(server, { service, validator }) {
    const handler = new SongsHandler(service, validator);
    server.route(routes(handler));
  },
};
