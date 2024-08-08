import { useState } from "react";

import "./App.css";
import AppLayout from "./layouts/app-layout";
import LandingPage from "./pages/landing";
import Auth from "./pages/auth";
import RedirectLink from "./pages/redirect-link";
import Link from "./pages/link";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoard from "./pages/dashboard";
import UrlProvider from "./context";
import RequireAuth from "./require-auth";

const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: "/",
				element: <LandingPage />,
			},
			{
				path: "/auth",
				element: <Auth />,
			},
			{
				path: "/dashboard",
				element: (
					//acts as a route gaurd cant be acessed if not logged in
					<RequireAuth>
						<DashBoard />,
					</RequireAuth>
				),
			},
			//showing the specific link page,about the click details
			{
				path: "/link/:id",
				element: (
					<RequireAuth>
						<Link />,
					</RequireAuth>
				),
			},
			{
				path: "/:id",
				element: <RedirectLink />,
			},
		],
	},
]);

function App() {
	return (
		<UrlProvider>
			<RouterProvider router={router} />
		</UrlProvider>
	);
}

export default App;
