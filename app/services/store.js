import Service, { inject } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import _ from 'lodash/fp';

// Check if web storage is available to the browser.
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const storageAvailable = _.curry((type) => {
  let storage;
  try {
    storage = window[type];
    let x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
});

const SAVED_FOR_LATER_KEY = 'saved';
const FAVORITES_KEY = 'favorites';

const localStorageAvailable = storageAvailable('localStorage');

const cache = _.curry((key, businesses) => {
  if (localStorageAvailable) {
    // localStorage is available.
    localStorage.setItem(key, JSON.stringify(businesses));
  }
});

const cacheSavedForLater = cache(SAVED_FOR_LATER_KEY);
const cacheFavorites = cache(FAVORITES_KEY);

const readCached = _.curry((key) => {
  if (localStorageAvailable) {
    let stringifiedBusinesses = localStorage.getItem(key);
    if (stringifiedBusinesses) {
      try {
        // Trick to coerce the parsed string into an array.
        return Object.values(JSON.parse(stringifiedBusinesses));
      } catch (e) {
        return [];
      }
    }
  }
  return [];
});

const readCachedSavedForLater = readCached(SAVED_FOR_LATER_KEY);
const readCachedFavorites = readCached(FAVORITES_KEY);

// The Store service stores data in memory and persists the data using
// the browser's native Web Storage API, more specifically, localStorage.
// - See https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API -
export default class Store extends Service {
  @inject yelp;

  // We track these properties in order to update our UI and reflect the
  // changes.
  @tracked business = [];
  @tracked saved = [];
  @tracked favorites = [];

  constructor(...args) {
    super(...args);

    // Load from localStorage.
    this.saved = [...readCachedSavedForLater];
    this.favorites = [...readCachedFavorites];
  }

  setRandomBusiness = async (businesses) => {
    let randomBusiness =
      businesses[Math.floor(Math.random() * businesses.length)];
    console.log('Selected', randomBusiness);

    // Make another api call so we can append hours to the
    // business.
    try {
      const { data } = await this.yelp.businesses(randomBusiness?.id);
      const { hours } = data;
      randomBusiness['is_open_now'] = hours[0]?.is_open_now;
    } catch (e) {
      console.error(e);
    }
    this.business = [randomBusiness];
  };

  saveBusiness = (business) => {
    this.setSaved([...this.saved, business]);
    alert('Saved business!');
  };

  setSaved = (businesses) => {
    // Make sure saved items are unique.
    this.saved = _.uniq([...businesses]);
    cacheSavedForLater(this.saved);
  };

  favoriteBusiness = (business) => {
    this.setFavorites([...this.favorites, business]);
    alert('Favorited business!');
  };

  setFavorites = (businesses) => {
    // Make sure favorited items are unique.
    this.favorites = _.uniq([...businesses]);
    cacheFavorites(this.favorites);
  };
}
