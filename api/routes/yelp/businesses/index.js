const axios = require('../../../lib/axios');
const { authenticate, authorize } = require('../../../auth');

async function yelpBusinesses(params, context) {
  await authorize('yelp/businesses', context);
  const { id } = params;
  const { data } = await axios.get(`/businesses/${id}`);
  return data;
}

exports.GET = async (req) =>
  await yelpBusinesses(req.query, await authenticate(req));
