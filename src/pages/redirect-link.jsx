import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
	//gets the parameter from link after "/"
	const { id } = useParams();
	//getting id and url from the params
	//useFetch hook is invoked here
	const { data, loading, fn } = useFetch(getLongUrl, id);
	//getting the clicks on the url
	const { loading: statsLoading, fn: fnStats } = useFetch(storeClicks, {
		id: data?.id,
		original_url: data?.original_url,
	});
	const navigate = useNavigate();
	//getting url when first time redirected to this page
	useEffect(() => {
		fn();
	}, []);

	//when data is recieved
	useEffect(() => {
		//fnStats has finally block for redirection
		if (!loading && data) alert("hii");
	}, [loading]);

	if (loading && statsLoading) {
		return (
			<>
				<BarLoader width="100%" color="#36d7b7" />
				<br />
				Redirecting....
			</>
		);
	}
	return null;
};

export default RedirectLink;
