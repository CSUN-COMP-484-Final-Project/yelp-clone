import Component from '@glimmer/component';

export default class FormComponent extends Component {
  constructor(...args) {
    super(...args);
    this.id = 'form';
    this.location = '';
    this.radius = 5;
    this.term = '';
    this.pricePoints = ['$', '$$', '$$$', '$$$$'];
  }

  submit = () => {
    console.log({
      location: this.location,
    });
  };

  setCurrentLocation = () => {
    console.log('Setting current location');
  };
}
