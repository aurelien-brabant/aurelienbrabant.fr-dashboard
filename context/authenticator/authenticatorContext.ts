import { FetchEventResult } from "next/dist/server/web/types";
import { createContext } from "react"

type AuthenticatorData = {
	token: string | null;
	setToken: (token: string) => void;
	user: BrabantApi.UserData | null;
	fetchUser: () => Promise<boolean>;
	fetchAs: (info: RequestInfo, init?: RequestInit | undefined) => Promise<Response>
}

const authenticatorContext = createContext<AuthenticatorData>({
	token: null,
	setToken: () => {},
	user: null,
	fetchUser: async () => false,
	fetchAs: async (info, init) => new Response()
});

export default authenticatorContext;
