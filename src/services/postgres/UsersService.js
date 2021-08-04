const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const InvariantError = require('../../exceptions/InvariantError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1 LIMIT 1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rows.length !== 0) {
      throw new InvariantError('Username already exists');
    }
  }

  async addUser({ username, password, fullname }) {
    // verify username is unique
    await this.verifyUsername(username);

    // hash password using bcrypt before storing
    const passwordHash = await bcrypt.hash(password, 10);

    // generate id using nanoid
    const id = `user-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, passwordHash, fullname],
    };
    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('Could not create user');
    }
    return result.rows[0].id;
  }

  async verifyUserCredentials(username, password) {
    const query = {
      text: 'SELECT * FROM users WHERE username = $1 AND password = $2 LIMIT 1',
      values: [username, password],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new AuthenticationError('Username or password is incorrect');
    }

    // match password with bcrypt hash
    const { id, password: passwordHash } = result.rows[0];
    const match = await bcrypt.compare(password, passwordHash);
    if (!match) {
      throw new AuthenticationError('Username or password is incorrect');
    }
    return id;
  }
}

module.exports = UsersService;
