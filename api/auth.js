require('dotenv-safe').config({
  path: process.env.NODE_ENV === 'production' ? './.env.prod' : './.env.dev',
  allowEmptyValues: true,
});

async function authenticate(req) {
  const { authorization: credentials } = req.headers;

  if (!credentials) {
    const err = new Error(
      JSON.stringify({
        errors: [{ title: 'Missing auth header' }],
      })
    );
    err.statusCode = 401;
    throw err;
  }

  const [_type, token] = (credentials || '').split(' ');

  const ALLOWED_TOKENS = process.env.TOKENS.split(',');

  if (!ALLOWED_TOKENS.includes(token)) {
    const err = new Error(
      JSON.stringify({
        errors: [{ title: 'Unauthorized' }],
      })
    );
    err.statusCode = 401;
    throw err;
  }

  // Authenticated
  const context = { user: true };
  return context;
}

function capabilities(context) {
  if (context?.user) {
    return ['yelp/businesses/search'];
  }
  return [];
}

async function authorize(capability, context) {
  const authorized = capabilities(context).includes(capability);
  if (!authorized) {
    const err = new Error(
      JSON.stringify({
        errors: [{ title: 'Unauthorized api call' }],
      })
    );
    err.statusCode = 401;
    throw err;
  }
  return true;
}

module.exports = {
  authenticate,
  authorize,
};
