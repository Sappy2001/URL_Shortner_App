import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header";

const AppLayout = () => {
	return (
		<div>
			<main className="min-h-screen container">
				<Header></Header>
				<Outlet />
			</main>
			<div className="p-2 w-100 text-center bg-gray-800 text-blue-100">
				made by Sappy
			</div>
		</div>
	);
};

export default AppLayout;
