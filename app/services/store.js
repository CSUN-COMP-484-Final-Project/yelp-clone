import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import _ from 'lodash/fp';

// Check if web storage is available to the browser
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
    // localStorage is available
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
        // Trick to coerce the parsed string into an array
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

export default class Store extends Service {
  @tracked business = [];
  @tracked saved = [];
  @tracked favorites = [];

  constructor(...args) {
    super(...args);

    // Load from localStorage
    this.saved = [...readCachedSavedForLater];
    this.favorites = [...readCachedFavorites];
  }

  setRandomBusiness = (businesses) => {
    const randomBusiness =
      businesses[Math.floor(Math.random() * businesses.length)];
    console.log('Selected', randomBusiness);
    this.business = [randomBusiness];
  };

  saveBusiness = (business) => {
    this.saved = _.uniq([...this.saved, business]);
    cacheSavedForLater(this.saved);
    alert('Saved business!');
  };

  favoriteBusiness = (business) => {
    this.favorites = _.uniq([...this.favorites, business]);
    cacheFavorites(this.favorites);
    alert('Favorited business!');
  };

  setFavorites = (businesses) => {
    this.favorites = _.uniq([...businesses]);
    cacheFavorites(this.favorites);
  };

  setSaved = (businesses) => {
    this.saved = _.uniq([...businesses]);
    cacheSavedForLater(this.saved);
  };
}
