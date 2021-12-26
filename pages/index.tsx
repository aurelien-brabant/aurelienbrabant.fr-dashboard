import { useContext } from 'react';
import Layout from '../src/Layout';
import Authenticator from "../src/Authenticator";
import authenticatorContext from "../context/authenticator/authenticatorContext";
import {Heading} from '@chakra-ui/react';

const Home = () => {
  const { user } = useContext(authenticatorContext);

  return (
    <Authenticator>
      <Layout>
        <Heading> Hello, {user?.username}! Welcome to the dashboard. </Heading>
      </Layout>
    </Authenticator>
  );
};

export default Home;
