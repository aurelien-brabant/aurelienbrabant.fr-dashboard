import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

import Authenticator from "../src/Authenticator";

import AuthenticatorProvider from "../context/authenticator/AuthenticatorProvider";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ChakraProvider>
      <AuthenticatorProvider>
          <Component {...pageProps} />
      </AuthenticatorProvider>
    </ChakraProvider>
  );
}

export default MyApp;
