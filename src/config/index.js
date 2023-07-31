// let baseURL = '10.135.48.102:8080';
let baseURL = '192.168.1.107:8080';
// let baseURL = 'www.altcabs.com';
//Live
// export const URL = 'https://altcabs.com/api';
// export const SOCKET_URL = 'wss://altcabs.com/api';
// export const URL = 'http://192.168.18.90:8080/api';
// export const SOCKET_URL = 'ws://192.168.18.90:8080/api';
export const URL = `http://${baseURL}/api`;
export const SOCKET_URL = `ws://${baseURL}`;

import {Platform} from 'react-native';

//Constant
export const GOOGLE_PLACES_API = 'AIzaSyCsn5C92b5e2G-gEiDhgbB9bXKHsKvmq1U';

// Test;
// export const URL =
//   Platform.OS === 'ios'
//     ? 'http://localhost:8082/api'
//     : 'http://192.168.100.7:8082/api';
// export const SOCKET_URL =
//   Platform.OS === 'ios'
//     ? 'ws://localhost:8082/api'
//     : 'ws://192.168.100.7:8082/api';
