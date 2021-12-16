import EmberRouter from '@ember/routing/router';
import config from 'yelp-clone/config/environment';

// This handles the routing with the different pages
// of our web app.
export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  // Home page
  this.route('home', { path: '/' });

  // Favorites page
  this.route('favorites');

  // Saved for Later page
  this.route('saved-for-later');
});
