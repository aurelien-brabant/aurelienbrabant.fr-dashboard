import React from "react";
import {
  Heading,
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  VStack,
  Textarea,
  Text,
  AspectRatio
} from "@chakra-ui/react";
import Image from 'next/image';
import { useEffect, useState, useContext } from "react";
import Authenticator from "../../src/Authenticator";
import Layout from "../../src/Layout";
import authenticatorContext from "../../context/authenticator/authenticatorContext";
import { useRouter } from "next/router";
import TagManager from "../../src/TagManager";

type FormData = {
  title: string;
  description: string;
  privacy: string;
  coverImagePath: string;
};

const BlogpostMeta: React.FC<{}> = ({}) => {
  const { fetchAs } = useContext(authenticatorContext);
  const router = useRouter();

  const [post, setPost] = useState<BrabantApi.BlogpostData>();
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    privacy: "",
    coverImagePath: "",
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [ tags, setTags ] = useState<string[]>([]);
  const [ error, setError ] = useState<null | string>(null);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    const id = window.location.pathname.substr(
      window.location.pathname.lastIndexOf("/") + 1
    );

    //setIsLoading(true);
    setIsWaitingForResponse(true);
    const res = await fetchAs(`/blogposts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, tags }),
    });
    setIsWaitingForResponse(false);


    if (res.status !== 200) {
      const json = await res.json();
      setError(json.msg);
    } else {
      setError(null);
    }

    //setIsLoading(false);
  };

  const fetchPost = async (postId: string): Promise<void> => {
    const res = await fetchAs(`/blogposts/${postId}`);

    if (res.status === 200) {
      const json: BrabantApi.BlogpostData = await res.json();
      setPost(json);
      setTags(json.tags);
      setFormData({
        title: json.title,
        description: json.description,
        privacy: "PRIVATE",
        coverImagePath: json.coverImagePath,
      });
    }
  };

  const fetchTags = async (): Promise<void> => {
    const res = await fetchAs("/blogposts/tags");

    if (res.status === 200) {
      const json = await res.json();

      setAvailableTags(json);
    }
  };

  useEffect(() => {
    const id = window.location.pathname.substr(
      window.location.pathname.lastIndexOf("/") + 1
    );

    fetchPost(id);
    fetchTags().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Heading>Louding...</Heading>;
  }

  return (
    <React.Fragment>
      <Heading textAlign="center">Edit post metadata</Heading>
      <form onSubmit={handleFormSubmit} method="PATCH">
        <VStack w="100%" spacing={3}>
          <SimpleGrid columns={4} spacing={3} w="100%" py={6}>
            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel textTransform="uppercase">Title</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  bg="gray.50"
                  onChange={handleFormChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel textTransform="uppercase">Description</FormLabel>
                <Textarea
                  name="description"
                  bg="gray.50"
                  onChange={handleFormChange}
                  value={formData.description}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel textTransform="uppercase">
                  Select visibility
                </FormLabel>
                <Select
                  name="privacy"
                  bg="gray.50"
                  value={formData.privacy}
                  onChange={handleFormChange}
                >
                  <option value="PRIVATE-PREV">
                    private-prev
                  </option>
                  <option value="PRIVATE">private</option>
                  <option value="PUBLIC">public</option>
                </Select>
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <VStack>
              <FormControl>
                <FormLabel textTransform="uppercase">cover URI</FormLabel>
                <Input
                  name="coverImagePath"
                  value={formData.coverImagePath}
                  bg="gray.50"
                  onChange={handleFormChange}
                />
              </FormControl>

                <AspectRatio ratio={1} width={100}>
                <img src={formData.coverImagePath ? formData.coverImagePath : "https://www.tg-geislingen.de/wp-content/uploads/2017/06/no-picture-300x300.png"} />
                </AspectRatio>
              </VStack>
            </GridItem>
          </SimpleGrid>

          <VStack w="100%" alignItems="start" spacing={3}>
                <Heading fontSize={22}>Select tags</Heading>
                <Text>
                  {" "}
                  Click to add or remove from the list, type in the input and
                  press enter to add a new tag{" "}
                </Text>
                <TagManager
                  initAvailableTags={[...availableTags]}
                  tags={tags}
                  setTags={setTags}
                />
              </VStack>
              
          <Button
            isLoading={isWaitingForResponse}
            type="submit"
            colorScheme="teal"
            size="lg"
          >
            {" "}
            Update{" "}
          </Button>
          { error &&
          <Text color="red.500">{error}</Text>
}
        </VStack>
      </form>
    </React.Fragment>
  );
};

const BlogpostPage = () => {
  return (
    <Authenticator>
      <Layout>
        <BlogpostMeta />
      </Layout>
    </Authenticator>
  );
};

export default BlogpostPage;
