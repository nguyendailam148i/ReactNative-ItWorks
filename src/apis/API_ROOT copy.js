import axios from 'axios';

const BASE_URL = 'http://187.123.41.101:1302';
const API_ROOT = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  withCredentials: true,
});

export default API_ROOT;
// export const API_ROOT = 'http://187.123.45.101:1302'