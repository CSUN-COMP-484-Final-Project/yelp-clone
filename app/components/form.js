import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { toMeters } from '../helpers/to-meters';

export default class FormComponent extends Component {
  @service yelp;
  @service store;
  constructor(...args) {
    super(...args);
    this.id = 'form';
    this.location = 'Northridge';
    this.radius = 5;
    this.term = '';
    this.pricePoints = ['$', '$$', '$$$', '$$$$'];
    this.pricePointFlags = [false, false, false, false];
    this.openNow = true;
    this.defaultParams = {
      open_now: true,
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
  };

  serializeParams = () => {
    const payload = {
      ...this.defaultParams,
    };

    // Location
    if (this.location) {
      payload['location'] = this.location;
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

    return payload;
  };
}
