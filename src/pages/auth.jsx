import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "../components/login";
import Signup from "../components/signup";
import { UrlState } from "@/context";

const Auth = () => {
	//it gets the extracts the query from url
	const [searchParams] = useSearchParams();
	const longLink = searchParams.get("createNew");
	const navigate = useNavigate();
	//getting values from context
	const { isAuthenticated, loading } = UrlState();
	useEffect(() => {
		if (isAuthenticated && !loading)
			navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
	}, [isAuthenticated, loading]);
	return (
		<div className="mt-28 flex flex-col items-center gap-10">
			<h2 className="text-5xl font-extrabold">
				{/* checks if createNew is present in querystring */}
				{longLink ? "Holdup lets login First..." : "SignUp/Login"}
			</h2>
			<Tabs defaultValue="login" className="w-[400px] ">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="login">Login</TabsTrigger>
					<TabsTrigger value="signup">Signup</TabsTrigger>
				</TabsList>
				<TabsContent value="login">
					<Login />
				</TabsContent>
				<TabsContent value="signup">
					<Signup />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Auth;
