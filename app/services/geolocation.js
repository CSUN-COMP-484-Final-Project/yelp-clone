import Service from '@ember/service';

export default class GeolocationService extends Service {
  constructor(...args) {
    super(...args);
  }

  get geolocation() {
    return navigator?.geolocation;
  }

  currentLocation = (...args) => {
    if (!this.geolocation) {
      return alert('Geolocation is not supported on your browser!');
    }
    const [onSuccess, onError, options] = args;
    return this.geolocation.getCurrentPosition(onSuccess, onError, options);
  };
}
