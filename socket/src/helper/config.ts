import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

axios.defaults.baseURL = `${process.env.API_URL}/v1`;

axios.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		return {
			error,
		};
	},
);

export default axios;
