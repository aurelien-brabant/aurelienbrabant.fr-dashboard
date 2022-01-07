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
  HStack,
  Link,
  useColorModeValue,
  FormControl,
  Input,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {NextPage} from "next";

const ProjectCard: React.FC<{ project: BrabantApi.ProjectPreview }> = ({
  project,
}) => {
  return (
    <NextLink href={`/projects/${project.projectId}`} passHref>
      <Link
        w="full"
        _hover={{
          textDecoration: "none",
        }}
      >
        <VStack
          alignItems="start"
          color="#fff"
          bgPosition="center"
          bgSize="cover"
          border="5px #fff solid"
          minH="150px"
          w="full"
          bgImage={`linear-gradient(rgba(0, 0, 0, .9),rgba(0, 0, 0, 0.85)) , url('${project.coverURI}')`}
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
              {project.name} - {project.role}
            </Heading>
            <Text color={"gray.200"}>{project.description}</Text>
          </Stack>
        </VStack>
      </Link>
    </NextLink>
  );
};

const ProjectsPage: NextPage = () => {
  const { fetchAs } = useContext(authenticatorContext);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<BrabantApi.ProjectPreview[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [error, setError] = useState<null | string>(null);

  const handleProjectCreation: FormEventHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const newPost = {
      name: projectTitle,
      description:
        "This is project's default description, feel free to change it!",
      coverURI:
        "https://images.unsplash.com/photo-1499380848949-2960e980ed02?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
      content: "There is where your writing begins",
      startTs: new Date(Date.now()),
      technologiesIds: [],
      role: "Developer"
    };

    let res = await fetchAs("/admin/projects", {
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

    res = await fetchAs('/admin/projects');
    setProjects((await res.json()));

    setLoading(false);
  };

  useEffect(() => {
    fetchAs("/admin/projects").then((res) => {
      res.json().then((json) => {
        setProjects(json);
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
            onSubmit={handleProjectCreation}
          >
            <Center>
              <HStack alignItems="center" w="full" maxW="800px">
                <FormControl w="80%">
                  <Input
                    name="title"
                    value={projectTitle}
                    placeholder="post's title"
                    onChange={(e) => {
                      setProjectTitle(e.target.value);
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
              projects.map((project) => (
                <ProjectCard key={project.projectId} project={project} />
              ))}
          </VStack>
        </VStack>
      </Layout>
  );
};

export default authenticatedRoute(ProjectsPage, { min: 10, max: 100, fallbackRoute: '/' });
