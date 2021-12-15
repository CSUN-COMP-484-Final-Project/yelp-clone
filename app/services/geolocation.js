import Service from '@ember/service';

export default class GeolocationService extends Service {
  constructor(...args) {
    super(...args);
  }

  get geolocation() {
    return navigator?.geolocation;
  }

  currentLocation = (...args) => {
    const [onSuccess, onError, options] = args;
    return this.geolocation.getCurrentPosition(onSuccess, onError, options);
  };
}
