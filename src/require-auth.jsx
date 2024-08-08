import React, { useEffect } from "react";
import { UrlState } from "./context";
import { useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";

const RequireAuth = ({ children }) => {
	const { isAuthenticated, loading } = UrlState();
	const navigate = useNavigate();
	useEffect(() => {
		//navigates to auth for redirection
		if (!isAuthenticated && loading === false) navigate("/auth");
	}, [isAuthenticated, loading]);
	//the child its wrapped around will only be shown if authenticated is true
	if (isAuthenticated) return children;

	if (loading) return <PacmanLoader width={"100%"} color="#36d7b7" />;
};

export default RequireAuth;
