import EmberRouter from '@ember/routing/router';
import config from 'yelp-clone/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', { path: '/' });
  this.route('favorites');
  this.route('saved-for-later');
});
