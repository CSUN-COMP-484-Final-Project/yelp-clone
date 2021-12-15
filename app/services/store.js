import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import _ from 'lodash/fp';

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
    this.saved = _.uniq([...this.saved, business]);
    alert('Saved business!');
  };

  favoriteBusiness = (business) => {
    this.favorites = _.uniq([...this.favorites, business]);
    alert('Favorited business!');
  };

  setFavorites = (businesses) => {
    this.favorites = _.uniq([...businesses]);
  };

  setSaved = (businesses) => {
    this.saved = _.uniq([...businesses]);
  };
}
