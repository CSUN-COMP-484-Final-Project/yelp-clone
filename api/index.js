require('dotenv-safe').config({
  path: process.env.NODE_ENV === 'production' ? './.env.prod' : './.env.dev',
  allowEmptyValues: true,
});

const path = require('path');
const micro = require('micro');
const morgan = require('micro-morgan');
const cors = require('micro-cors');
const fsRouter = require('fs-router');
const _ = require('lodash/fp');

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',');
const ALLOWED_METHODS = ['OPTIONS', 'GET'];

const match = fsRouter(path.join(__dirname, 'routes'));

const handler = _.pipe([
  cors({ allowMethods: ALLOWED_METHODS }),
  morgan('tiny'),
  (next) => (req, res) => {
    if (ALLOWED_ORIGINS.includes(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
    }

    return next(req, res);
  },
])((req, res) => {
  if (req.method === 'OPTIONS') {
    return micro.send(res, 200);
  }

  const matched = match(req);
  if (matched) return matched(req, res);

  res.statusCode = 404;

  return {
    errors: [{ title: 'Not found' }],
  };
});

const server = () => micro(handler);

server().listen(process.env.PORT || 4201);

module.exports = server;
