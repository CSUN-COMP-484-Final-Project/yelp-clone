require('dotenv').config();

const path = require('path');
const micro = require('micro');
const morgan = require('micro-morgan');
const fsRouter = require('fs-router');
const _ = require('lodash/fp');

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(',');
const ALLOWED_METHODS = ['OPTIONS', 'GET'];

const match = fsRouter(path.join(__dirname, 'routes'));

const handler = _.pipe([
  morgan('tiny'),
  (next) => (req, res) => {
    if (ALLOWED_ORIGINS.includes(req.headers.origin)) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS.join(', '));
    res.setHeader('Access-Control-Max-Age', 24 * 60 * 60);

    return next(req, res);
  },
])((req, res) => {
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
