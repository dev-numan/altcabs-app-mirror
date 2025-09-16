import {Platform} from 'react-native';

export const GOOGLE_PLACES_API = 'AIzaSyCsn5C92b5e2G-gEiDhgbB9bXKHsKvmq1U';

/**
 * Use below Credientials for live server
 * Usman And Nauman Qamar have the access to live server logs and deployments
 */
// let baseURL = 'www.altcabs.com';
// export const URL = `https://${baseURL}/api`;
// export const SOCKET_URL = `wss://${baseURL}`;

/**
 * Use below credientials for development server
 */
const DEV_HOST = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
const DEV_PORT = 8080;
let baseURL = `${DEV_HOST}:${DEV_PORT}`;
export const URL = `http://${baseURL}/api`;
export const SOCKET_URL = `ws://${baseURL}`;

//Constant

// Test;
// export const URL =
//   Platform.OS === 'ios'
//     ? 'http://localhost:8082/api'
//     : 'http://192.168.100.7:8082/api';
// export const SOCKET_URL =
//   Platform.OS === 'ios'
//     ? 'ws://localhost:8082/api'
//     : 'ws://192.168.100.7:8082/api';
