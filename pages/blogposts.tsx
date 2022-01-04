import { useContext, useEffect, useState } from "react"
import authenticatorContext from "../context/authenticator/authenticatorContext"
import Authenticator from "../src/Authenticator";
import Layout from '../src/Layout';

import Image from 'next/image';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from "next/link";

const BlogpostCard: React.FC<{ post: BrabantApi.BlogpostPreview }> = ({ post }) => {
  return (
    <Link href={`/blogposts/${post.blogpostId}`}>
    <a>
    <Center py={3}>
      <Box
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}>
     
        <Stack>
          <Text
            color={'green.500'}
            textTransform={'uppercase'}
            fontWeight={800}
            fontSize={'sm'}
            letterSpacing={1.1}>
          </Text>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}>
            { post.title }
          </Heading>
          <Text color={'gray.500'}>
              {post.description}
          </Text>
        </Stack>
        <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
          <Avatar
            src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
            alt={'Author'}
          />
          <Stack direction={'column'} spacing={0} fontSize={'sm'}>
            <Text fontWeight={600}>{post.authorUsername}</Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
    </a>
    </Link>
  );
}

const Blogposts = () => {
    const { fetchAs } = useContext(authenticatorContext);
    const [ loading, setLoading ] = useState(true);
    const [ posts, setPosts ] = useState<BrabantApi.BlogpostPreview[]>([]);

    useEffect(() => {
        fetchAs('/admin/blogposts').then(res => { res.json().then(json => {
            console.log(json);
            setPosts(json.posts);
            setLoading(false);
        }) })
    }, [])

    return <Authenticator>
        <Layout>
            {
                !loading && posts.map(post => (
                    <BlogpostCard key={post.blogpostId} post={post} />
                ))
            }
        </Layout>
    </Authenticator>
}

export default Blogposts;