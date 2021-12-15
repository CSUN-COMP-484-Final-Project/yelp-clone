import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { toMeters } from '../helpers/to-meters';

export default class FormComponent extends Component {
  @service yelp;
  @service store;
  @service geolocation;
  @tracked location;
  constructor(...args) {
    super(...args);
    this.id = 'form';
    this.location = 'Northridge';
    this.position;
    this.radius = 5;
    this.term = '';
    this.pricePoints = ['$', '$$', '$$$', '$$$$'];
    this.pricePointFlags = [false, false, false, false];
    this.openNow = true;
    this.defaultParams = {
      limit: 50,
    };
  }

  submit = () => {
    this.yelp
      .businessesSearch({
        ...this.serializeParams(),
      })
      .then(({ data }) => {
        const { businesses } = data;
        this.store.setRandomBusiness(businesses);
      })
      .catch(console.error);
  };

  setCurrentLocation = () => {
    console.log('Setting current location');
    this.geolocation.currentLocation(
      (position) => {
        this.position = position;
        this.location = 'Current Location';
      },
      (error) => {
        switch (error.code) {
          case error.TIMEOUT:
          case error.PERMISSION_DENIED:
            alert('Please enable location services on this browser.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        }
      },
      {
        maximumAge: Infinity,
        timeout: 30000,
      }
    );
  };

  serializeParams = () => {
    const payload = {
      ...this.defaultParams,
    };

    // Location
    if (this.location) {
      payload['location'] = this.location;
    }

    if (this.location === 'Current Location' && this.position) {
      // Remove location and use coords instead
      delete payload['location'];
      const { coords } = this.position;
      const { latitude, longitude } = coords;
      payload['latitude'] = latitude;
      payload['longitude'] = longitude;
    }

    // Limit the radius range between 1 and 24 miles
    // According to fusion yelp api:
    // 'The max value is 40000 meters (about 25 miles)'
    let radius = parseInt(this.radius);
    if (radius > 24) {
      radius = 24;
    } else if (radius <= 1) {
      radius = 1;
    }
    payload['radius'] = toMeters([radius]);

    // Term
    if (this.term) {
      payload['term'] = this.term;
    }

    // Build the price
    const price = Object.entries(this.pricePointFlags)
      .filter(([_k, value]) => value)
      .map(([k]) => parseInt(k) + 1)
      .join(',');
    if (price) {
      payload['price'] = price;
    }

    payload['open_now'] = this.openNow;

    return payload;
  };
}
