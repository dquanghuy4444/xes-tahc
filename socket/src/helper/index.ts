/* eslint-disable default-param-last */
import axios from './config';

const handleTransformResponse = (response) => {
	if (response?.success) {
		return response.payload;
	}

	return false;
};

const fetchData = async(path: string, payload: any = null) => {
	try {
		const response = await axios.get(`${path}`, payload);

		return handleTransformResponse(response);
	} catch (ex) {
		return {
			error: ex,
		};
	}
};

const putData = async(path, data) => {
	try {
		const response = await axios.put(path, {
			...data,
		});

		return handleTransformResponse(response);
	} catch (ex) {
		return {
			error: ex,
		};
	}
};

const postData = async(path, data) => {
	try {
		const temp = {
			...data,
		};
		const response = await axios.post(path, temp);

		return handleTransformResponse(response);
	} catch (ex) {
		return {
			error: ex,
		};
	}
};

const deleteData = async(path, idItem) => {
	try {
		const response = await axios.delete(`${path}/${idItem}`);
		if (response?.data?.id) {
			return true;
		}

		return false;
	} catch (ex) {
		return {
			error: ex,
		};
	}
};

export { fetchData, deleteData, putData, postData };
