import Service from '@ember/service';
import axios from 'axios';
import ENV from 'yelp-clone/config/environment';

// Interface with our API that wraps Yelp's API.
// Unfortunately Yelp's API does not natively support CORS. Their motivation
// behind this decision could be to protect their API keys from being used
// on the client side.
// - See https://github.com/Yelp/yelp-fusion/issues/579 -
//
// Since many browsers enforce same-origin policy, we implement our own
// CORS policy on our API.
// - See https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS -
//
// Additionally because our deployment strategy deploys our web
// app via HTTPS we need to ensure that our backend is also deployed with
// HTTPS since browsers do not allow HTTPS -> HTTP calls to be made due to
// mixed-content policy
// - See https://www.netlify.com/blog/2018/07/02/all-new-sites-on-netlify-are-https-by-default/ -
// - See https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content/How_to_fix_website_with_mixed_content -
export default class YelpService extends Service {
  constructor(...args) {
    super(...args);
    this.axios = axios.create({
      baseURL: `${ENV.APP.API_URL}yelp`,
      headers: {
        authorization: `Bearer ${ENV.APP.API_TOKEN}`,
      },
    });
  }

  businessesSearch(params) {
    return this.axios.get('/businesses/search', {
      params,
    });
  }

  businesses(id) {
    if (id) {
      return this.axios.get('/businesses', {
        params: { id },
      });
    }
  }
}
