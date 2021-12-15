const axios = require('../../../lib/axios');
const { authenticate, authorize } = require('../../../auth');

async function yelpBusinessesSearch(params, context) {
  await authorize('yelp/businesses/search', context);
  const { data } = await axios.get('/businesses/search', { params });
  return data;
}

module.exports.GET = async (req) =>
  await yelpBusinessesSearch(req.query, await authenticate(req));
