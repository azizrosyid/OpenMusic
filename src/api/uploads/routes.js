const path = require('path');

function routes(handler) {
  return [
    {
      method: 'POST',
      path: '/upload/pictures',
      handler: handler.postUploadPictureHandler,
      options: {
        auth: {
          strategy: 'openmusic_jwt',
          mode: 'optional',
        },
        payload: {
          allow: 'multipart/form-data',
          maxBytes: 500 * 1024,
          multipart: true,
          output: 'stream',
        },
      },
    },
    {
      method: 'GET',
      path: '/upload/pictures/{param*}',
      handler: {
        directory: {
          path: path.resolve(__dirname, 'files'),
        },
      },
    },
  ];
}

module.exports = routes;
