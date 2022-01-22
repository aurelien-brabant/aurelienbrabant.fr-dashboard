import React, { useEffect, useState } from "react";
import {
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Button,
  TagLeftIcon,
  TagRightIcon,
  TagLabel,
  Tag,
  InputRightElement,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type TagManagerProps = {
  initAvailableTags: string[];
  tags: string[],
  setTags: any,
};

const TagManager: React.FC<TagManagerProps> = ({
  initAvailableTags,
  tags,
  setTags,
}) => {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [addedTag, setAddedTag] = useState("");

  useEffect(() => {
    setAvailableTags(initAvailableTags);
  }, []);

  const handleTagAction = (clickedTag: string, isAttachedToPost: boolean) => {
    if (isAttachedToPost) {
      setTags(tags.filter((tag) => clickedTag !== tag));
    } else {
      setTags([...tags, clickedTag]);
    }
  };

  return (
    <SimpleGrid columns={4} spacing={2}>
      <GridItem colSpan={1}>
        <HStack>
          <FormControl>
              <InputGroup>
              <InputLeftElement pointerEvents="none">
              <AddIcon color="gray.300" />
            </InputLeftElement>
            <Input
                  bgColor="#141414"
                  borderColor="#191b1f"
              name="addedTag"
              bg="gray.50"
              placeholder="New tag"
              value={addedTag}
              onChange={(e) => {
                setAddedTag(e.target.value.toUpperCase());
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!availableTags.includes(addedTag)) {
                    setAvailableTags([...availableTags, addedTag]);
                  }
                  setAddedTag("");
                }
              }}
            />
     
            </InputGroup>
          </FormControl>
        </HStack>
      </GridItem>

      <GridItem colSpan={3}>
        <HStack wrap={"wrap"} w="100%">
          {availableTags.map((tag) => {
            const isAttachedToPost = tags.includes(tag);

            return (
              <Tag
                my={2}
                size={"md"}
                key={tag}
                borderRadius="2px"
                variant="solid"
                px={5}
                py={1}
                onClick={() => handleTagAction(tag, isAttachedToPost)}
                bgColor={!isAttachedToPost ? "#141414" : "#e2725b"}
              >
                {tag}
              </Tag>
            );
          })}
        </HStack>
      </GridItem>
    </SimpleGrid>
  );
};

export default TagManager;
