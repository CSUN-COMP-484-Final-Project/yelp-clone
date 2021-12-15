import Service from '@ember/service';
import axios from 'axios';
import ENV from 'yelp-clone/config/environment';

export default class YelpService extends Service {
  constructor(...args) {
    super(...args);
    this.axios = axios.create({
      baseURL: `${ENV.APP.API_URL}yelp`,
      headers: {
        authorization: `Bearer ${ENV.APP.API_TOKEN}`,
      },
    });
    console.log(ENV.APP.API_URL);
    console.log(ENV.APP.API_TOKEN);
  }

  businessesSearch(params) {
    return this.axios.get('/businesses/search', {
      params,
    });
  }
}
