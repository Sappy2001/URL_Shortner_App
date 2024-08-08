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
import { login } from "@/db/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/context";
const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState([]);
	//using the login fuction from authApi to check credentials,
	//passing formData values to it
	//getting fn as fnLogin
	const {
		data,
		error: fetchError,
		loading,
		fn: fnLogin,
	} = useFetch(login, formData);
	const { fetchUser } = UrlState();
	const handleChange = (e) => {
		const { name, value } = e.target;
		//previous value spreading and including new values provided
		setFormData((prevValue) => ({
			...prevValue,
			[name]: value,
		}));
	};
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const longLink = searchParams.get("createNew");

	useEffect(() => {
		console.log(fetchError);
		if (!fetchError && data) {
			navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
			fetchUser();
		}
	}, [data, fetchError]);
	async function handleLogin() {
		setError([]);
		try {
			const schema = Yup.object().shape({
				email: Yup.string()
					.email("Not a valid Email")
					.required("Email is Required"),
				password: Yup.string()
					.min(6, "Passsword must be atleast 6 characters ")
					.required("Email is Required"),
			});
			//abortEarly:Stops validation on the first encountered error,here it will check all fields and show all errors
			await schema.validate(formData, { abortEarly: false });
			//api call,goes to authApi login func with formData
			await fnLogin();
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
				<CardTitle>Login</CardTitle>
				<CardDescription>Login to your account if you have one</CardDescription>
				<Error message={fetchError ? fetchError.message : ""} />
			</CardHeader>
			<CardContent>
				<div className="space-y-1">
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
			</CardContent>
			<CardFooter>
				<Button className="w-full" onClick={handleLogin}>
					{loading ? <ScaleLoader /> : "Login"}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Login;
