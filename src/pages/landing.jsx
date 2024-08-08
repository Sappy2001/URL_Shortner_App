import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
	const [longUrl, setLongUrl] = useState();
	const navigate = useNavigate();
	const handleSubmit = (e) => {
		e.preventDefault();
		navigate(`/auth?createNew=${longUrl}`);
	};

	return (
		<div className="flex flex-col items-center">
			<h2 className="my-10 sm:my-16 text-3xl  sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
				The Url Shortner that does the deed 👇
			</h2>
			<form
				onSubmit={handleSubmit}
				className="sm:h-14 flex flex-col sm:flex-row w-full gap-4 items-center md:w-2/4"
			>
				<Input
					type="url"
					value={longUrl}
					placeholder="Enter your lOOooong url"
					className="py-4 px-4 h-full flex-1"
					onChange={(e) => {
						setLongUrl(e.target.value);
					}}
				/>
				<Button variant="destructive" className="h-full" type="Submit">
					Shorten
				</Button>
			</form>
			<img src="" alt="banner" className="w-full my-11 md:px-11 bg-slate-400" />
			<Accordion type="multiple" collapsible className="w-full md:px-11">
				<AccordionItem value="item-1">
					<AccordionTrigger>
						How does Trimmer Url Shortnerr works?
					</AccordionTrigger>
					<AccordionContent>
						Yes. It adheres to the WAI-ARIA design pattern.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Is it accessible?</AccordionTrigger>
					<AccordionContent>
						Yes. It adheres to the WAI-ARIA design pattern.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger>Is it accessible?</AccordionTrigger>
					<AccordionContent>
						Yes. It adheres to the WAI-ARIA design pattern.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default LandingPage;
