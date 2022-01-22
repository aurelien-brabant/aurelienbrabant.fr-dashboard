import { FormEventHandler, useContext, useEffect, useState } from "react";
import authenticatorContext from "../context/authenticator/authenticatorContext";
import Authenticator from "../src/Authenticator";
import Layout from "../src/Layout";
import authenticatedRoute from "../src/AuthenticatedRoute";

import {
  Center,
  VStack,
  Button,
  Heading,
  Text,
  Stack,
  Avatar,
  HStack,
  Link,
  useColorModeValue,
  FormControl,
  Input,
} from "@chakra-ui/react";
import NextLink from "next/link";

const BlogpostCard: React.FC<{ post: BrabantApi.BlogpostPreview }> = ({
  post,
}) => {
  return (
    <NextLink href={`/blogposts/${post.blogpostId}`} passHref>
      <Link
        href={`/blogposts/${post.blogpostId}`}
        w="full"
        _hover={{
          textDecoration: "none",
        }}
      >
        <VStack
          alignItems="start"
          w="full"
          bg="#141414"
          rounded={"md"}
          boxShadow="md"
          p={6}
          overflow={"hidden"}
          transition="transform .2s"
          _hover={{
            transform: "translateX(.5em)",
          }}
        >
          <Stack>
            <Text
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            ></Text>
            <Heading
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              {post.title}
            </Heading>
            <Text>{post.description}</Text>
          </Stack>
          <Stack mt={6} direction={"row"} spacing={4} align={"center"}>
            <Avatar
              src={"https://avatars0.githubusercontent.com/u/1164541?v=4"}
              alt={"Author"}
            />
            <Stack direction={"column"} spacing={0} fontSize={"sm"}>
              <Text fontWeight={600}>{post.authorUsername}</Text>
            </Stack>
          </Stack>
        </VStack>
      </Link>
    </NextLink>
  );
};

const Blogposts = () => {
  const { fetchAs, user } = useContext(authenticatorContext);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BrabantApi.BlogpostPreview[]>([]);
  const [postTitle, setPostTitle] = useState("");
  const [error, setError] = useState<null | string>(null);

  const handlePostCreation: FormEventHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const newPost = {
      title: postTitle,
      description:
        "This is post's default description, feel free to change it!",
      coverImagePath:
        "https://images.unsplash.com/photo-1499380848949-2960e980ed02?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      authorId: (user as BrabantApi.UserData).userId,
      content: "There is where your writing begins",
      tags: [] as string[],
    };

    let res = await fetchAs("/admin/blogposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (res.status != 200) {
      const { msg: errorMsg } = await res.json();

      setError(errorMsg);
    }

    res = await fetchAs('/admin/blogposts');
    setPosts((await res.json()).posts);

    setLoading(false);
  };

  useEffect(() => {
    console.log('vroomm');
    fetchAs("/admin/blogposts").then((res) => {
      res.json().then((json) => {
        setPosts(json.posts);
        setLoading(false);
      });
    });
  }, []);

  return (
      <Layout>
        <VStack w="full" spacing={5}>
          {/* add new post form */}
          <form
            method="POST"
            style={{ width: "100%" }}
            onSubmit={handlePostCreation}
          >
            <Center>
              <HStack alignItems="center" w="full" maxW="800px">
                <FormControl w="80%">
                  <Input
                    name="title"
                    value={postTitle}
                    placeholder="post's title"
                    onChange={(e) => {
                      setPostTitle(e.target.value);
                    }}
                  />
                </FormControl>
                <Button type="submit" isLoading={loading} bgColor="green.300" px={10}>
                  New blogpost
                </Button>
              </HStack>
            </Center>
          </form>

          {error && <Text color="red.800">{error}</Text>}

          <VStack alignItems="start" w="full" spacing={5}>
            {!loading &&
              posts.map((post) => (
                <BlogpostCard key={post.blogpostId} post={post} />
              ))}
          </VStack>
        </VStack>
      </Layout>
  );
};

export default authenticatedRoute(Blogposts, { min: 10, max: 100, fallbackRoute: '/' });
