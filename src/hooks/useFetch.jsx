import { useState } from "react";
//Custom hook created

//option here is additional parameter its an emp obj
const useFetch = (cb, options = {}) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	//adding additional parameter when calling fn
	const fn = async (...args) => {
		setLoading(true);
		// clears any previous error
		setError(null);
		try {
			const response = await cb(options, ...args);
			setData(response);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	};
	return { data, error, loading, fn };
};

export default useFetch;
