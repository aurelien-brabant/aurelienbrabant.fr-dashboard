import { Heading, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import authenticatorContext from "../context/authenticator/authenticatorContext";

const Authenticator: React.FC<{}> = ({ children }) => {
	const router = useRouter();
	const { user, fetchUser } = useContext(authenticatorContext);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!user) {
			(async () => {
				const isUserLoggedIn = await fetchUser();
				if (!isUserLoggedIn) {
					console.log("User not logged in");
					router.push("/login");
				}
			})();
		}

		setIsLoading(false);
	});

	if (isLoading) {
		return <VStack h="100vh" justifyContent='center'><Heading>Loading...</Heading></VStack>;
	}

	return <React.Fragment>{!isLoading && children}</React.Fragment>;
};

export default Authenticator;
