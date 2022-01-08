import { useState, useEffect } from "react";

import authenticatorContext from "./authenticatorContext";

const AuthenticatorProvider: React.FC<{}> = ({ children }) => {
	const [user, setUser] = useState<BrabantApi.UserData | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const localToken = window.localStorage.getItem("jwt_token");

		if (localToken) {
			console.log('Got localtoken');
			setToken(localToken);
		}
		setIsLoading(false);
	}, []);

	const setTokenWrapper = (newToken: string) => {
		setToken(newToken);
		window.localStorage.setItem("jwt_token", newToken);
	};

	const fetchAs = async (info: RequestInfo, init?: RequestInit | undefined) => {
		const reqinit: RequestInit = init ? init : {};

			reqinit.headers = {
				...(init && init.headers),
				'Authorization': `Bearer ${token}`
			};

		return fetch(`${process.env.NEXT_PUBLIC_API_URI}${info}`, reqinit);
	}

	const fetchUser = async (): Promise<BrabantApi.UserData | null> => {
		if (!token) {
			return null;
		}

		const res = await fetchAs('/auth/login');

		if (res.status === 200) {
			const json =  await res.json();
			setUser(json);
			return json as BrabantApi.UserData;
		}

		// token is invalid
		if (res.status === 401) {
			setToken(null);
		}


		return null;
	};

	return (
		<authenticatorContext.Provider
			value={{
				token,
				setToken: setTokenWrapper,
				user,
				fetchUser,
				fetchAs,
			}}
		>
			{!isLoading && children}
		</authenticatorContext.Provider>
	);
};

export default AuthenticatorProvider;
