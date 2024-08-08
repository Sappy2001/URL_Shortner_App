import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/useFetch";
import { signOut } from "@/db/authApi";
import { PacmanLoader } from "react-spinners";
const Header = () => {
	const navigate = useNavigate();

	const { user, fetchUser } = UrlState();
	const { loading, fn: fnLogout } = useFetch(signOut);

	return (
		<>
			<nav className="py-4 flex justify-between items-center">
				<Link to="/">
					<img src="" alt="logoImage" />
				</Link>
				<div>
					{!user ? (
						<Button onClick={() => navigate("/auth")}>Login</Button>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
								<Avatar>
									<AvatarImage
										src={user?.user_metadata?.profile_pic}
										className="object-contain"
									/>
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>
									{user?.user_metadata?.name}
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<LinkIcon className="mr-2 h-4 w-4" />
									My Links
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-500">
									<LogOut className="mr-2 h-4 w-4" />
									<span
										onClick={() => {
											fnLogout().then(() => {
												fetchUser();
												navigate("/");
											});
										}}
									>
										Logout
									</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</nav>
			{loading ? <PacmanLoader width={"100%"} color="#36d7b7" /> : ""}
		</>
	);
};

export default Header;
