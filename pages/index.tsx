import { useContext } from 'react';
import Layout from '../src/Layout';
import authenticatedRoute from '../src/AuthenticatedRoute';
import authenticatorContext from "../context/authenticator/authenticatorContext";
import {Heading} from '@chakra-ui/react';

const Home = () => {
  const { user } = useContext(authenticatorContext);

  return (
      <Layout>
        <Heading> Hello, {user?.username}! Welcome to the dashboard. </Heading>
      </Layout>
  );
};

export default authenticatedRoute(Home);
