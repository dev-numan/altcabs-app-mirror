import axios from 'axios';
import {URL} from '../config';
console.log('Using API Call', URL);
const API = axios.create({
  baseURL: URL,
});
export default API;
