import { Copy, Download, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/useFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrl }) => {
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

	const { loading, fn: fnDelete } = useFetch(deleteUrl, url?.id);
	return (
		<div className="flex flex-col sm:flex-row gap-5 border p-4  mt-2 overflow-hidden">
			<img
				src={url?.qr}
				alt="qr code"
				className="h-32 object-contain ring ring-blue-400 self-start bg-white rounded-lg"
			/>
			<Link
				to={`/link/${url?.id}`}
				className="flex flex-col flex-1 items-start"
			>
				<span className="text-3xl font-extrabold hover:underline cursor-pointer">
					{url?.title}
				</span>
				<span className="text-2xl text-blue-400 font-bold  hover:underline cursor-pointer">
					https://shortl.in/
					{url?.custom_url ? url.custom_url : url.short_url}
				</span>
				<span className="font-bold  hover:underline cursor-pointer">
					{url?.original_url}
				</span>
				<span className="text-green-400 text-sm font-extralight flex-1 items-end">
					{new Date(url?.created_at).toLocaleDateString()}
				</span>
			</Link>
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
						fnDelete().then(() => fetchUrl());
					}}
				>
					{loading ? <BeatLoader size={5} color="white" /> : <Trash />}
				</Button>
			</div>
		</div>
	);
};

export default LinkCard;
