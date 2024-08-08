import React, { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ScaleLoader from "react-spinners/ScaleLoader";
import * as Yup from "yup";
import Error from "./error";
import useFetch from "@/hooks/useFetch";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";
import { signup } from "@/db/authApi";

const Signup = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		name: "",
		profile_pic: null,
	});
	const [error, setError] = useState([]);
	const handleChange = (e) => {
		//as profile_pic is a file
		const { name, value, files } = e.target;
		//previous value spreading and including new values provided
		setFormData((prevValue) => ({
			...prevValue,
			[name]: files ? files[0] : value,
		}));
	};
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const longLink = searchParams.get("createNew");
	//using the login fuction from authApi to check credentials,
	//passing formData values to it
	//import fn as fnLogin
	const {
		data,
		error: fetchError,
		loading,
		fn: fnSignup,
	} = useFetch(signup, formData);
	const { fetchUser } = UrlState();
	useEffect(() => {
		console.log(fetchError);
		if (!fetchError && data) {
			navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
			fetchUser();
		}
	}, [data, fetchError]);
	async function handleSignup() {
		setError([]);
		try {
			const schema = Yup.object().shape({
				name: Yup.string().required("Name is required"),
				email: Yup.string()
					.email("Not a valid Email")
					.required("Email is Required"),
				password: Yup.string()
					.min(6, "Passsword must be atleast 6 characters ")
					.required("Email is Required"),
				profile_pic: Yup.mixed().required("profile_pic is required"),
			});
			//abortEarly:Stops validation on the first encountered error,here it will check all fields and show all errors
			await schema.validate(formData, { abortEarly: false });
			//api call,goes to authApi login func with formData
			await fnSignup();
		} catch (error) {
			const newErrors = {};
			//Yup returns error.inner obj containing all the errors
			error?.inner?.forEach((err) => {
				newErrors[err.path] = err.message;
			});
			setError(newErrors);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Signup</CardTitle>
				<CardDescription>Create a new account</CardDescription>
				<Error message={fetchError ? fetchError.message : ""} />
			</CardHeader>
			<CardContent>
				<div className="space-y-1">
					<Input
						type="text"
						name="name"
						placeholder="Enter name"
						onChange={handleChange}
					/>
					<Error message={error.name} />
				</div>
				<div className="space-y-1 mt-3">
					<Input
						type="email"
						name="email"
						placeholder="Enter Email"
						onChange={handleChange}
					/>
					<Error message={error.email} />
				</div>
				<div className="space-y-1 mt-3">
					<Input
						type="password"
						name="password"
						placeholder="Enter Password"
						onChange={handleChange}
					/>
					<Error message={error.password} />
				</div>
				<div className="space-y-1 mt-3">
					<Input
						type="file"
						name="profile_pic"
						accept="image/*"
						onChange={handleChange}
					/>
					<Error message={error.profile_pic} />
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full" onClick={handleSignup}>
					{loading ? <ScaleLoader /> : "Create Account"}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Signup;
