import { Button } from "@/components/ui/button";
import { UrlState } from "@/context";
import { getUrlClicks } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/useFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import LocationStats from "@/components/location-stats";
import DeviceStats from "@/components/device-stats";

const Link = () => {
	// link/:id
	const { id } = useParams();

	const { user } = UrlState();
	const navigate = useNavigate();
	const {
		loading,
		data: url,
		fn,
		error,
	} = useFetch(getUrl, { id, user_id: user?.id });

	// as /link/${url?.id}-page redirect to link
	const {
		loading: loadingStats,
		data: stats,
		fn: fnStats,
	} = useFetch(getUrlClicks, id);

	const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);
	useEffect(() => {
		fn();
		fnStats();
	}, []);
	const downloadImage = () => {
		const imageUrl = url?.custom_url ? url.custom_url : url.short_url;
		const fileName = url?.title;
		const anchor = document.createElement("a");
		anchor.href = imageUrl;
		//download is anchortag func that says the link to be download not navigated,anchor helps in file downloads
		anchor.download = fileName;
		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	};

	if (error) {
		navigate("/dashboard");
	}
	let link = "";
	if (url) {
		link = url?.custom_url ? url?.custom_url : url?.short_url;
	}

	const fullUrl = window.location.href;
	const baseUrl = fullUrl.split("/").slice(0, 3).join("/");
	const reqUrl = baseUrl + "/" + link;
	return (
		<>
			{(loading || loadingStats) && (
				<BarLoader width="100%" className="mb-4" color="#36d7b7" />
			)}

			<div className="flex flex-col sm:flex-row gap-8 justify-between ">
				{/* more than small width 2/5 */}
				<div className="flex items-center sm:items-start flex-col gap-8 rounded-lg sm:w-2/5">
					<span className="font-extrabold text-6xl hover:underline cursor-pointer">
						{url?.title}
					</span>
					<a
						href={reqUrl}
						target="_blank"
						className="font-bold text-3xl  sm:text-4xl hover:underline cursor-pointer text-blue-400"
					>
						{reqUrl}
					</a>
					<a
						href={url?.original_url}
						target="_blank"
						className="flex flex-col md:flex-row items-center gap-2 hover:underline cursor-pointer"
					>
						<LinkIcon className="ml-1" />
						{url?.original_url}
					</a>
					<span className="flex self-start font-extralight text-sm text-green-300">
						{new Date(url?.created_at).toLocaleString()}
					</span>
					<div className="flex gap-2">
						<Button
							variant="ghost"
							onClick={() =>
								//will copy the url in clipboard
								navigator.clipboard.writeText(
									url?.custom_url ? url.custom_url : url.short_url
								)
							}
						>
							<Copy />
						</Button>
						<Button variant="ghost" onClick={downloadImage}>
							<Download />
						</Button>
						<Button
							variant="ghost"
							onClick={(e) => {
								fnDelete();
							}}
						>
							<Trash />
						</Button>
					</div>
					<img
						src={url?.qr}
						alt="qr code"
						className="w-full self-center sm:self-start ring-blue-500 p-1 bg-white object-contain
							 rounded-lg ring"
					/>
				</div>

				<Card className="flex flex-col sm:w-3/5">
					<CardHeader>
						<CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
					</CardHeader>
					<CardContent>
						{stats && stats?.length ? (
							<div className="flex flex-col gap-6">
								<Card>
									<CardHeader>
										<CardTitle>Links Clicks</CardTitle>
									</CardHeader>
									<CardContent>
										<p>{stats?.length}</p>
									</CardContent>
								</Card>

								<CardTitle>Location Data</CardTitle>
								<LocationStats stats={stats} />
								<CardTitle>Device Info</CardTitle>
								<DeviceStats stats={stats} />
							</div>
						) : loadingStats === false ? (
							"No Statistics yet"
						) : (
							"Loading Statistics..."
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default Link;
