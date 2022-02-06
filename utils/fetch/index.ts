import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {retries: 5});

export default axios;