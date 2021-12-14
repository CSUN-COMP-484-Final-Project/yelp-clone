require('dotenv').config();
const axios = require('axios').default;

module.exports.GET = async (req) => {
  const params = req.query;
  const { data } = await axios.get(
    'https://api.yelp.com/v3/businesses/search',
    {
      headers: {
        authorization: `Bearer ${process.env.DEV_YELP_API_KEY}`,
      },
      params,
    }
  );
  return data;
};
