import axiosInstance from './index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class GenericService {
  apiPrefix = '';
  endPoint = '/api/';
  http = null;
  constructor(apiPrefix) {
    this.apiPrefix = apiPrefix;
    this.http = axiosInstance;
    this.endPoint = '/api/' + apiPrefix;
  }

  //not in use
  query = query =>
    new Promise((resolve, reject) => {
      axiosInstance
        .post(this.endPoint + '/query', {query})
        .then(res => {
          resolve(res.data);
        })
        .catch(res => {
          reject(res.data);
        });
    });

  get = url =>
    new Promise(async (resolve, reject) => {
      if (!axiosInstance.defaults.headers.common['x-auth-token']) {
        let token = await AsyncStorage.getItem('Token');
        axiosInstance.defaults.headers.common['x-auth-token'] = token;
      }
      axiosInstance
        .get(url)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    });
  post = (url, data) =>
    new Promise(async (resolve, reject) => {
      if (!axiosInstance.defaults.headers.common['x-auth-token']) {
        let token = await AsyncStorage.getItem('Token');
        axiosInstance.defaults.headers.common['x-auth-token'] = token;
      }
      axiosInstance
        .post(url, data)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    });
  delete = url =>
    new Promise((resolve, reject) => {
      axiosInstance
        .delete(url)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    });
  put = (url, data) =>
    new Promise((resolve, reject) => {
      axiosInstance
        .put(url, data)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    });
}
