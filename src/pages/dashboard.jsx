import CreateLink from "@/components/create-link";
import Error from "@/components/error";
import LinkCard from "@/components/link-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/context";
import { getClicks } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const DashBoard = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const { user } = UrlState();
	const {
		loading,
		error,
		data: urls,
		fn: fnUrls,
	} = useFetch(getUrls, user?.id);
	const {
		loading: loadingClicks,
		error: clickError,
		data: clicks,
		fn: fnClicks,
	} = useFetch(
		getClicks,
		//as it takes array of url_ids
		urls?.map((url) => url.id)
	);
	useEffect(() => {
		fnUrls();
		console.log(urls);
	}, []);

	//if there is url(0:false 1-99:true)
	useEffect(() => {
		if (urls?.length) fnClicks();
		console.log(clicks);
	}, [urls?.length]);

	//if the url title equals to searchquery else all urls
	const filteredUrls = urls?.filter((url) =>
		url.title.toLowerCase().includes(searchQuery?.toLowerCase())
	);
	return (
		<div className="flex flex-col gap-8">
			{(loading || loadingClicks) && <BarLoader width="100%" color="#36d7b7" />}
			<div className="grid grid-cols-2 gap-4">
				<Card>
					<CardHeader>
						<CardTitle>Links Created</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{urls?.length}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Total Clicks</CardTitle>
					</CardHeader>
					<CardContent>
						<p>{clicks?.length}</p>
					</CardContent>
				</Card>
			</div>
			<div className="flex justify-between">
				<h1>My Links</h1>
				<CreateLink />
			</div>
			{/* relative given for the filter icon is absolute */}
			<div className="relative">
				<Input
					type="text"
					placeholder="filter your links...."
					value={searchQuery}
					onChange={(e) => {
						setSearchQuery(e.target.value);
					}}
				/>
				<Filter className="absolute top-2 right-2 p-1" />
				{<Error message={error ? error.message : ""} />}
				{filteredUrls?.map((url, i) => {
					return <LinkCard key={i} url={url} fetchUrl={fnUrls} />;
				})}
			</div>
		</div>
	);
};

export default DashBoard;
