import axios from 'axios';
import {GOOGLE_PLACES_API} from '../config/index';

export const DirectionApi = (from, to, callback) => {
  return async () => {
    console.log('FROM AND TO IN DIRECTION API::', from, to);
    await axios
      .get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${from.latitude},${from.longitude}&destination=${to.latitude},${to.longitude}&key=${GOOGLE_PLACES_API}`,
      )
      .then(response => {
        console.log('response', response);
        if (response.data.status === 'OK') callback(response.data.routes[0]);
      })
      .catch(error => {
        console.log('ERROR IN DIRECTION API::', error);
        let content;
        if (error.response) {
          content = error.response.error_message;
        } else if (error.request) {
          content = 'Bad Request!';
        } else {
          content = error.message;
        }
      });
  };
};
