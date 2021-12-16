import Service from '@ember/service';

// GeolocationService interfaces with the browsers native
// Geolocation API
// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
export default class GeolocationService extends Service {
  constructor(...args) {
    super(...args);
  }

  // Getter to return the geolocation object if available
  // Pseudo checker for compatability
  get geolocation() {
    return navigator?.geolocation;
  }

  // Returns the user's currentLocation
  currentLocation = (...args) => {
    if (!this.geolocation) {
      return alert('Geolocation is not supported on your browser!');
    }
    const [onSuccess, onError, options] = args;
    return this.geolocation.getCurrentPosition(onSuccess, onError, options);
  };
}
