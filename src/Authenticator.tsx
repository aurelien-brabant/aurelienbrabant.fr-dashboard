import { Heading, VStack } from "@chakra-ui/react";
import {NextPage} from "next";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import authenticatorContext from "../context/authenticator/authenticatorContext";

const Authenticator: NextPage = ({ children, ...rest }) => {


	const router = useRouter();
	const { user, fetchUser } = useContext(authenticatorContext);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			fetchUser().then((isUserLoggedIn) => {
				if (!isUserLoggedIn) {
					console.log("User not logged in");
					router.push("/login");
				} else {
					setIsLoading(false);
				}
			});
		}
	}, []);

	if (isLoading) {
		return (
			<VStack h="100vh" justifyContent="center">
				<Heading>Loading...</Heading>
			</VStack>
		);
	}

	return <React.Fragment>{!isLoading && user && children}</React.Fragment>;
};

export default Authenticator;
