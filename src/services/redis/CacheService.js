/* eslint-disable no-console */
const redis = require('redis');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });

    this.client.on('error', (err) => {
      console.log(`Redis error: ${err}`);
    });
  }

  set(key, value, ttl = 3600) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', ttl, (err, res) => {
        if (err) return reject(err);

        return resolve(res);
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) return reject(err);
        if (reply === null) return reject(new Error(`Key ${key} not found`));
        return resolve(reply.toString());
      });
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, count) => {
        if (err) return reject(err);
        return resolve(count);
      });
    });
  }
}
module.exports = CacheService;
