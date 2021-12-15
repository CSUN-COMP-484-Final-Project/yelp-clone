require('dotenv-safe').config({
  path: process.env.NODE_ENV === 'production' ? './.env.prod' : './.env.dev',
  allowEmptyValues: true,
});

const axios = require('axios').default;

module.exports = axios.create({
  baseURL: 'https://api.yelp.com/v3',
  timeout: 30000,
  headers: {
    authorization: `Bearer ${process.env.YELP_API_KEY}`,
  },
});
