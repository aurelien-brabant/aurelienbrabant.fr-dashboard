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
  Box,
  AspectRatio,
  HStack,
  FormHelperText,
  InputLeftAddon,
  InputGroup,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import authenticatedRoute from "../../src/AuthenticatedRoute";
import Layout from "../../src/Layout";
import authenticatorContext from "../../context/authenticator/authenticatorContext";
import nullify from "../../lib/nullify";

type FormData = {
  name: string;
  description: string;
  role: string;
  coverURI: string;
  content: string;
  startTs: string;
  endTs: string;
  privacy: "PRIVATE" | "PRIVATE-PREV" | "PUBLIC";
  companyName: string;
  githubLink: string;
  gitlabLink: string;
  giteaLink: string;
  projectLink: string;
};

const BlogpostMeta: React.FC<{}> = ({}) => {
  const { fetchAs } = useContext(authenticatorContext);

  const [project, setProject] = useState<BrabantApi.Project>();
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    role: "",
    companyName: "",
    coverURI: "",
    content: "",
    startTs: new Date(Date.now()).toISOString(),
    endTs: new Date(Date.now()).toISOString(),
    privacy: "PRIVATE",
    gitlabLink: "",
    githubLink: "",
    giteaLink: "",
    projectLink: "",
  });
  const [technologies, setTechnologies] = useState<BrabantApi.Technology[]>([]);
  const [technologiesIds, setTechnologiesIds] = useState<string[]>([]);
  const [editContentMode, setEditContentMode] = useState(false);
  const [error, setError] = useState<null | string>(null);

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

    setIsWaitingForResponse(true);

    // nullify fields that are optional
    const requestBody: any = nullify<string>(
      { ...formData, technologiesIds },
      ["githubLink", "gitlabLink", "giteaLink", "projectLink", "companyName"],
      (v) => v.length === 0
    );

    console.log(requestBody);

    const res = await fetchAs(`/admin/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    setIsWaitingForResponse(false);

    if (res.status !== 200) {
      const json = await res.json();
      setError(json.msg);
    } else {
      setError(null);
    }
  };

  const fetchPost = async (postId: string): Promise<void> => {
    const res = await fetchAs(`/admin/projects/${postId}`);

    if (res.status === 200) {
      const json: BrabantApi.Project = await res.json();
      setProject(json);
      setFormData({
        name: json.name,
        description: json.description,
        role: json.role,
        companyName: json.companyName ? json.companyName : "",
        coverURI: json.coverURI,
        content: json.content,
        startTs: json.startTs,
        endTs: json.endTs ? json.endTs : new Date(Date.now()).toISOString(),
        privacy: json.privacy,
        githubLink: json.githubLink ? json.githubLink : "",
        gitlabLink: json.gitlabLink ? json.gitlabLink : "",
        giteaLink: json.giteaLink ? json.giteaLink : "",
        projectLink: json.projectLink ? json.projectLink : ""
      });
      setTechnologiesIds(
        json.technologies.map((techno) => techno.technologyId)
      );
    }
  };

  const fetchTechnologies = async (): Promise<void> => {
    const res = await fetchAs("/technologies");

    if (res.status === 200) {
      const json = await res.json();

      setTechnologies(json);
    }
  };

  useEffect(() => {
    const id = window.location.pathname.substr(
      window.location.pathname.lastIndexOf("/") + 1
    );

    (async () => {
      await fetchPost(id);
      await fetchTechnologies();
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <Heading>Louding...</Heading>;
  }

  if (editContentMode) {
    return (
      <VStack>
        <Heading>Edit content of '{project?.name}'</Heading>
        <Button
          bgColor="blue.300"
          onClick={() => {
            setEditContentMode(false);
          }}
        >
          Back
        </Button>
        <FormControl>
          <Textarea
            bgColor="#141414"
            borderColor="#191b1f"
            name="content"
            minHeight="80vh"
            onChange={handleFormChange}
          >
            {formData.content}
          </Textarea>
        </FormControl>
      </VStack>
    );
  }

  return (
    <VStack>
      <Heading textAlign="center">
        Edit project metadata (#{project?.projectId})
      </Heading>
      <Button
        bgColor="blue.300"
        onClick={() => {
          setEditContentMode(true);
        }}
      >
        Edit content
      </Button>
      <form onSubmit={handleFormSubmit} method="PATCH">
        <VStack w="100%" spacing={3}>
          <SimpleGrid columns={4} spacing={3} w="100%" py={6}>
            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel textTransform="uppercase" htmlFor="name">
                  Name
                </FormLabel>
                <Input
                  bgColor="#141414"
                  borderColor="#191b1f"
                  name="name"
                  value={formData.name}
                  bg="gray.50"
                  onChange={handleFormChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel htmlFor="description" textTransform="uppercase">
                  Description
                </FormLabel>
                <Textarea
                  bgColor="#141414"
                  borderColor="#191b1f"
                  name="description"
                  bg="gray.50"
                  onChange={handleFormChange}
                  value={formData.description}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel htmlFor="role" textTransform="uppercase">
                  Role
                </FormLabel>
                <Input
                  bgColor="#141414"
                  borderColor="#191b1f"
                  name="role"
                  value={formData.role}
                  bg="gray.50"
                  onChange={handleFormChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel htmlFor="companyName" textTransform="uppercase">
                  Company
                </FormLabel>
                <Input
                  bgColor="#141414"
                  borderColor="#191b1f"
                  name="companyName"
                  value={formData.companyName}
                  bg="gray.50"
                  onChange={handleFormChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel htmlFor="startTs" textTransform="uppercase">
                  Beginning date
                </FormLabel>
                <Input
                  bgColor="#141414"
                  borderColor="#191b1f"
                  type="date"
                  value={formData.startTs.split("T")[0]}
                  name="startTs"
                  bg="gray.50"
                  onChange={handleFormChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel htmlFor="endTs" textTransform="uppercase">
                  Ending date
                </FormLabel>
                <Input
                  bgColor="#141414"
                  borderColor="#191b1f"
                  type="date"
                  value={formData.endTs.split("T")[0]}
                  name="endTs"
                  bg="gray.50"
                  onChange={handleFormChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel htmlFor="privacy" textTransform="uppercase">
                  Select visibility
                </FormLabel>
                <Select
                  bgColor="#141414"
                  borderColor="#191b1f"
                  name="privacy"
                  bg="gray.50"
                  value={formData.privacy}
                  onChange={handleFormChange}
                >
                  <option value="PRIVATE-PREV">private-prev</option>
                  <option value="PRIVATE">private</option>
                  <option value="PUBLIC">public</option>
                </Select>
                <FormHelperText>
                  PRIVATE-PREV makes the blogpost private but allows previewing
                  it using a special link
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <VStack>
                <FormControl isRequired>
                  <FormLabel htmlFor="coverURI" textTransform="uppercase">
                    cover URI
                  </FormLabel>
                  <Input
                    bgColor="#141414"
                    borderColor="#191b1f"
                    name="coverURI"
                    value={formData.coverURI}
                    bg="gray.50"
                    onChange={handleFormChange}
                  />
                </FormControl>

                <AspectRatio ratio={1} width={100}>
                  <img
                    alt="preview image"
                    src={
                      formData.coverURI.startsWith("http")
                        ? formData.coverURI
                        : `${location.protocol}//${process.env.NEXT_PUBLIC_HOST_PORT}/${formData.coverURI}`
                    }
                  />
                </AspectRatio>
              </VStack>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel textTransform="uppercase">Gitlab Link</FormLabel>
                <InputGroup size="sm">
                  <InputLeftAddon bgColor="#e2725b" borderColor="#191b1f">
                    https://gitlab.com
                  </InputLeftAddon>
                  <Input
                    bgColor="#141414"
                    borderColor="#191b1f"
                    value={formData.gitlabLink}
                    name="gitlabLink"
                    bg="gray.50"
                    onChange={handleFormChange}
                  />
                </InputGroup>
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel textTransform="uppercase">Github Link</FormLabel>
                <InputGroup size="sm">
                  <InputLeftAddon bgColor="#e2725b" borderColor="#191b1f">
                    https://github.com/
                  </InputLeftAddon>
                  <Input
                    bgColor="#141414"
                    borderColor="#191b1f"
                    value={formData.githubLink}
                    name="githubLink"
                    bg="gray.50"
                    onChange={handleFormChange}
                  />
                </InputGroup>
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel textTransform="uppercase">Gitea link</FormLabel>
                <InputGroup size="sm">
                  <InputLeftAddon bgColor="#e2725b" borderColor="#191b1f">
                    https://git.aurelienbrabant.fr
                  </InputLeftAddon>
                  <Input
                    bgColor="#141414"
                    borderColor="#191b1f"
                    value={formData.giteaLink}
                    name="giteaLink"
                    bg="gray.50"
                    onChange={handleFormChange}
                  />
                </InputGroup>
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel textTransform="uppercase">Project link</FormLabel>
                <Input
                  bgColor="#141414"
                  borderColor="#191b1f"
                  value={formData.projectLink}
                  name="projectLink"
                  bg="gray.50"
                  onChange={handleFormChange}
                />
              </FormControl>
            </GridItem>
          </SimpleGrid>

          <VStack w="100%" alignItems="start" spacing={3}>
            <Heading fontSize={22}>Select technologies</Heading>
            <Text> Click to add or remove from the list</Text>

            <HStack spacing={6}>
              {technologies.map((techno) => {
                const isSelected = technologiesIds.includes(
                  techno.technologyId
                );

                return (
                  <Box
                    key={techno.name}
                    opacity={isSelected ? 1 : 0.4}
                    onClick={() => {
                      if (!isSelected) {
                        setTechnologiesIds([
                          ...technologiesIds,
                          techno.technologyId,
                        ]);
                      } else {
                        setTechnologiesIds(
                          technologiesIds.filter(
                            (id) => techno.technologyId !== id
                          )
                        );
                      }
                    }}
                  >
                    <ChakraImage src={techno.logoURI} w="30px" h="auto" />
                  </Box>
                );
              })}
            </HStack>
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
          {error && <Text color="red.500">{error}</Text>}
        </VStack>
      </form>
    </VStack>
  );
};

const BlogpostPage = () => {
  return (
    <Layout>
      <BlogpostMeta />
    </Layout>
  );
};

export default authenticatedRoute(BlogpostPage, {
  min: 10,
  max: 100,
  fallbackRoute: "/",
});
