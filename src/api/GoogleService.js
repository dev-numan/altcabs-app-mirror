import GenericService from './GenericService';

class GoogleService extends GenericService {
  constructor() {
    super('google');
  }
  autocomplete = query => this.post('/google/autocomplete', {query});

  autocompletePostCodes = query =>
    this.post('/google/autocomplete/postcodes', {query});
  directions = data => this.post('/google/directions', data);
  
  reverseGeocode = (latitude, longitude) => this.post('/google/reverse-geocode', {
    latitude,
    longitude
  });
}
const googleService = new GoogleService();
export default googleService;
