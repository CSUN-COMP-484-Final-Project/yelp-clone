import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class FormComponent extends Component {
  @service yelp;
  constructor(...args) {
    super(...args);
    this.id = 'form';
    this.location = 'Northridge';
    this.radius = 5;
    this.term = '';
    this.pricePoints = ['$', '$$', '$$$', '$$$$'];
    this.openNow = true;
    this.defaultParams = {
      limit: 50,
      open_now: true,
    };
  }

  submit = () => {
    this.yelp
      .businessesSearch({
        ...this.serializeParams(),
      })
      .then(console.log)
      .catch(console.error);
  };

  setCurrentLocation = () => {
    console.log('Setting current location');
  };

  serializeParams = () => {
    return {
      ...this.defaultParams,
      location: this.location,
    };
  };
}
