import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class Store extends Service {
  @tracked business = [];
  @tracked saved = [];
  @tracked favorites = [];

  constructor(...args) {
    super(...args);
  }

  setRandomBusiness = (businesses) => {
    const randomBusiness =
      businesses[Math.floor(Math.random() * businesses.length)];
    console.log('Selected', randomBusiness);
    this.business = [randomBusiness];
  };

  saveBusiness = (business) => {
    this.saved = [...this.saved, business];
  };

  favoriteBusiness = (business) => {
    this.favorites = [...this.favorites, business];
  };
}
