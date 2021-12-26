import type { NextPage } from "next";
import { FormEvent, useState, useContext, useEffect } from "react";
import authenticatorContext from "../context/authenticator/authenticatorContext";
import {
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Container,
  VStack,
  Link,
  Button,
} from "@chakra-ui/react";
import {useRouter} from "next/router";

const Login: NextPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { token, setToken } = useContext(authenticatorContext);

  const router = useRouter();

  useEffect(() => {
    if (token) {
      // user is already logged in
      router.back();
    }
  }, []);

  const attemptLogin = async (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    if (process.env.NEXT_PUBLIC_API_URI) {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URI + '/auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login, password
        })
      });

      
      const json = await res.json();

      if (res.status === 200) {
        setToken(json.accessToken);
        router.push('/myaccount');
      } else {
        setError(json.msg);
      }
      
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <VStack h="100vh" justifyContent="center" spacing={10}>
        <VStack>
          <Heading textAlign="center">
            {" "}
            Welcome to the aurelienbrabant.fr dashboard{" "}
          </Heading>
          <Text>
            {" "}
            Built with the awesome{" "}
            <Link href="https://chakra-ui.com/">Chakra UI framework</Link>
          </Text>
        </VStack>
        <form onSubmit={attemptLogin}>
          <VStack spacing={3}>
            <FormControl>
              <FormLabel id="login"> Login (email address / username)</FormLabel>
              <Input
                id="login"
                placeholder="johndoe@gmail.com"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel id="password"> Password </FormLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          <Button type='submit' isLoading={isLoading} >Log in</Button>
          { error && (
            <Text color="red.800">Error: {error} </Text>
          )}
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;
