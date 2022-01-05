import { Heading, VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState, useContext } from "react";
import authenticatorContext from "../context/authenticator/authenticatorContext";

/**
 * This High Order Component takes the NextPage that requires authentication
 * as its first argument, and returns a component that requests authentication at mount time,
 * preventing the NextPage to render if authentication wasn't successful.
 *
 * Special user rights are configured through the expectedRoleLevel object that defines the minimum
 * role level required to access the page (0 by default, inclusive) and the maximum one (100 by default, exclusive).
 *
 * Authentication data is kept inside the authenticatorContext, so that the authentication
 * process does not has to be repeated each time a page is mounted.
 */

const authenticatedRoute = (
	NextPage: NextPage,
	roleConfig: { min: number; max: number; fallbackRoute: string } = {
		min: 0,
		max: 100,
		fallbackRoute: "/",
	},
	loginFallbackRoute: string = "/login"
) => {
	const AuthenticatedRoute: React.FC<{}> = () => {
		const { user, fetchUser } = useContext(authenticatorContext);
		const [isLoading, setIsLoading] = useState(true);
		const router = useRouter();

		useEffect(() => {
			let actualUserData = user;
			setIsLoading(true);

			(async () => {
				if (!actualUserData) {
					actualUserData = await fetchUser();

					if (!actualUserData) {
						router.push(loginFallbackRoute);
					}
				}

				if (actualUserData) {
					if (
						actualUserData.role < roleConfig.min ||
						actualUserData.role >= roleConfig.max
					) {
						router.push(roleConfig.fallbackRoute);
					} else {
						setIsLoading(false);
					}
				}
			})();
		}, [router.asPath]); /* rerun this effect each time the route changes */

		if (isLoading) {
			return (
				<VStack minH="100vh" justifyContent="center">
					<Heading>Authenticating user...</Heading>
				</VStack>
			);
		}

		return <NextPage />;
	};

	return AuthenticatedRoute;
};

export default authenticatedRoute;
