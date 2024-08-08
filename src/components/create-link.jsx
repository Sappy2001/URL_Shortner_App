import { UrlState } from "@/context";
import React, { useEffect, useRef, useState } from "react";
import { QRCode } from "react-qrcode-logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Error from "./error";
import { Card } from "./ui/card";
import * as Yup from "yup";
import useFetch from "@/hooks/useFetch";
import { BeatLoader } from "react-spinners";
import { createUrl } from "@/db/apiUrls";
const CreateLink = () => {
	const { user } = UrlState();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const longLink = searchParams.get("createNew");
	const [errors, setErrors] = useState();
	const [formValues, setFormValues] = useState({
		title: "",
		longUrl: longLink ? longLink : "",
		customUrl: "",
	});

	const ref = useRef();

	const schema = Yup.object().shape({
		title: Yup.string().required("Title is required"),
		longUrl: Yup.string()
			.url("Must be a alid url")
			.required("long url is required"),
		customUrl: Yup.string(),
	});

	const handleChange = (e) => {
		setFormValues({
			//destructuring all the previous form values
			...formValues,
			//id is the key for formValues
			[e.target.id]: e.target.value,
		});
	};

	const {
		error,
		loading,
		data,
		fn: fnCreateUrl,
	} = useFetch(createUrl, { ...formValues, user_id: user.id });

	useEffect(() => {
		if (error === null && data) {
			navigate(`/link/${data[0].id}`);
		}
	}, [data, error]);

	const createNewLink = async () => {
		setErrors([]);
		try {
			//abortEarly:all validation errors collected before stopping
			await schema.validate(formValues, { abortEarly: false });
			//ref.current gives access to QRcode Dom
			//qrCode has ref of canvas in it which is accessed by canvasRef.current
			const canvas = ref.current.canvasRef.current;
			//conveting this canvas toBinaryData(BLOB)
			const blob = await new Promise((resolve) => canvas.toBlob(resolve));
			await fnCreateUrl(blob);
		} catch (error) {
			const newErrors = {};
			//Yup returns error.inner obj containing all the errors
			e?.inner?.forEach((err) => {
				newErrors[err.path] = err.message;
			});
			setErrors(newErrors);
		}
	};

	return (
		<Dialog
			//opens on page load if longLink is present
			defaultOpen={longLink}
			// openChange triggers when dialog changes from open to close
			//res:true(open),false(close),if close the searchParams=null

			onOpenChange={(res) => {
				if (!res) setSearchParams();
			}}
		>
			<DialogTrigger>
				<Button variant="destructive">Create new link</Button>
			</DialogTrigger>
			<DialogContent classname="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="font-bold text-2xl">Create Link</DialogTitle>
				</DialogHeader>
				{formValues.longUrl ? (
					<QRCode
						value={formValues.longUrl}
						size={200}
						ref={ref}
						className="w-max m-auto"
					/>
				) : (
					<></>
				)}
				<Input
					id="title"
					placeholder="Enter Link Title"
					value={formValues.title}
					onChange={handleChange}
				/>
				{errors?.title ? <Error message={errors.title} /> : ""}
				<Input
					id="longUrl"
					placeholder="Enter Link To Shorten..."
					value={formValues.longUrl}
					onChange={handleChange}
				/>
				{errors?.longUrl ? <Error message={errors.longUrl} /> : ""}
				<div className="flex items-center h-10">
					<Card className="p-2 rounded-r-none">shortl.in/</Card>
					<Input
						id="customUrl"
						placeholder="Enter Custom Link (optional)"
						className="border-l-0 rounded-l-none"
						value={formValues.customUrl}
						onChange={handleChange}
					/>
				</div>
				{/* this error is coming from useFetch */}
				{error ? <Error message={error.message} /> : ""}

				<DialogFooter className="sm:justify-start">
					<Button diabled={loading} onClick={createNewLink} type="submit">
						{loading ? <BeatLoader size={10} color="white" /> : "create"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateLink;
