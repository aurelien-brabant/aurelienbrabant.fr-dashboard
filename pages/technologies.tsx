import { NextPage } from "next";

import Layout from "../src/Layout";

import authenticatorContext from "../context/authenticator/authenticatorContext";

import authenticatedRoute from "../src/AuthenticatedRoute";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import {
  Image as ChakraImage,
  Button,
  Heading,
  Text,
  HStack,
  VStack,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  GridItem,
  SimpleGrid,
  Link as ChakraLink
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";

type TechnologyFormProps = {
  setSelectedTechno: Dispatch<SetStateAction<BrabantApi.Technology | undefined | null>>,
  selectedTechno: BrabantApi.Technology | null,
}

const TechnologyForm: React.FC<TechnologyFormProps> = ({
  selectedTechno, setSelectedTechno
}) => {
  const { fetchAs } = useContext(authenticatorContext);
  const [formData, setFormData] = useState<{ name: string; logoURI: string }>({
    name: selectedTechno ? selectedTechno.name : '',
    logoURI: selectedTechno ? selectedTechno.logoURI : '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetchAs(`/admin/technologies/${selectedTechno ? selectedTechno.technologyId : ''}`, {
      method: selectedTechno ? 'PATCH' : 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (res.status !== 200) {
      try {
      const { msg } = await res.json();

      console.error(msg);
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoading(false);
    setSelectedTechno(undefined);
  }

  return (
    <VStack w="full" spacing={5}>
    <form style={{ width: "100%" }} onSubmit={handleSubmit}>
      <HStack w="full" spacing={10} px={10}>
        <VStack w="full">
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input name="name" value={formData.name} onChange={handleOnChange} />
        </FormControl>
        <FormControl>
          <FormLabel>logo URI</FormLabel>
          <Input name="logoURI" value={formData.logoURI} onChange={handleOnChange} />
        </FormControl>
        </VStack>
        <VStack minW="400px">
        <ChakraImage
          maxW="80px"
          h="auto"
          src={formData.logoURI}
          alt={`${formData.name}'s logo`}
        />
          <Button isLoading={isLoading} bgColor="green.300" type="submit">Save</Button>
        </VStack>
      </HStack>
    </form>
      <ChakraLink onClick={() => { setSelectedTechno(undefined) }} > Go back to technologies </ChakraLink>
    </VStack>
  );
};

const TechnologiesPage: NextPage = () => {
  const { fetchAs } = useContext(authenticatorContext);
  const [technologies, setTechnologies] = useState<BrabantApi.Technology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTechno, setSelectedTechno] =
    useState<BrabantApi.Technology | undefined | null>(undefined);

  const fetchTechnologies = async () => {
    setIsLoading(true);
    const res = await fetchAs("/technologies");

    if (res.status === 200) {
      setTechnologies(await res.json());
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (selectedTechno === undefined) {
      fetchTechnologies();
    }
  }, [selectedTechno]);

  if (isLoading) {
    return <Layout><Heading>Loading...</Heading></Layout>
  }

  if (selectedTechno !== undefined) {
    return (
      <Layout>
        <VStack minH="80vh" justifyContent="center">
          <TechnologyForm selectedTechno={selectedTechno} setSelectedTechno={setSelectedTechno} />
        </VStack>
      </Layout>
    );
  }

  return (
    <Layout>
      <VStack>
        <HStack>
          <Heading> Technologies </Heading>
        <IconButton
          aria-label="add technology"
          bgColor="green.300"
          icon={<AddIcon />}
          onClick={() => { setSelectedTechno(null) }}
        />
        </HStack>
        <SimpleGrid columns={5} w="full" py={10} spacing={5}>
          {technologies.map((tech) => (
            <GridItem colspan={1}>
            <VStack
              key={tech.technologyId}
              border="1px rgba(0, 0, 0, .1) solid"
              bgColor="gray.50"
              borderRadius="5px"
              boxShadow="lg"
              spacing={5}
              minW="200px"
              py={2}
              justifyContent="center"
            >
              <HStack w="full" justifyContent="center">
                <Text>{tech.name}</Text>
                <ChakraImage
                  maxW="50px"
                  h="auto"
                  src={tech.logoURI}
                  alt={`${tech.name}'s logo`}
                />
              </HStack>
              <HStack >
                <IconButton
                  bgColor="orange.300"
                  aria-label="edit technology"
                  icon={<EditIcon />}
                  onClick={() => {
                    setSelectedTechno(tech);
                  }}
                />
                <IconButton
                  aria-label="delete technology"
                  bgColor="gray.300"
                  icon={<DeleteIcon />}
                />
              </HStack>
            </VStack>
            </GridItem>
          ))}
        </SimpleGrid>
      </VStack>
    </Layout>
  );
};

export default authenticatedRoute(TechnologiesPage, {
  min: 10,
  max: 100,
  fallbackRoute: "/",
});
