import useFetch from "./hooks/useFetch";
import { getCurrentUser } from "./db/authApi";
import { createContext, useContext, useEffect } from "react";

const UrlContext = createContext();

//making the context wrappable and providing values for the context
const UrlProvider = ({ children }) => {
	const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);

	const isAuthenticated = user?.role === "authenticated";
	useEffect(() => {
		fetchUser();
	}, []);
	return (
		<UrlContext.Provider value={{ user, fetchUser, loading, isAuthenticated }}>
			{children}
		</UrlContext.Provider>
	);
};

//func to use the context & get value in other comps
export const UrlState = () => {
	return useContext(UrlContext);
};

export default UrlProvider;
