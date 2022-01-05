import { createContext } from "react"

type AuthenticatorData = {
	token: string | null;
	setToken: (token: string) => void;
	user: BrabantApi.UserData | null;
	fetchUser: () => Promise<BrabantApi.UserData | null>
	fetchAs: (info: RequestInfo, init?: RequestInit | undefined) => Promise<Response>
}

const authenticatorContext = createContext<AuthenticatorData>({
	token: null,
	setToken: () => {},
	user: null,
	fetchUser: async () => null,
	fetchAs: async (info, init) => new Response()
});

export default authenticatorContext;
