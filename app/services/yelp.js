import Service from '@ember/service';
import axios from 'axios';

export default class YelpService extends Service {
  constructor(...args) {
    super(...args);
    this.axios = axios.create({
      baseURL: 'http://localhost:4201/yelp',
    });
  }

  businessesSearch(params) {
    return this.axios.get('/businesses/search', {
      params,
    });
  }
}
