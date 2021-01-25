import { useMutation, useQuery } from '@apollo/client';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  List,
  ListItem,
  Spinner,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';

import Header from '@/components/Header';

import { GET_CATEGORIES_BY_AUTHOR_ID_QUERY } from '@/graphql/queries';
import {
  CREATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_BY_ID_MUTATION
} from '@/graphql/mutations';
import { useAuth } from '@/lib/auth';

const Categories = () => {
  const { user } = useAuth();
  const authorId = user?.uid;
  const { loading, error, data } = useQuery(GET_CATEGORIES_BY_AUTHOR_ID_QUERY, {
    variables: { authorId },
    skip: authorId === undefined
  });
  const [createCategory, { loading: creatingCategory }] = useMutation(
    CREATE_CATEGORY_MUTATION
  );
  const [deleteCategory, { loading: deletingCategory }] = useMutation(
    DELETE_CATEGORY_BY_ID_MUTATION
  );
  const { register, handleSubmit } = useForm();
  const toast = useToast();

  if (loading || !user) {
    return (
      <Box h="100vh" backgroundColor="gray.100">
        <Header active="categories" />
        <Flex px={8} pt={4} justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      </Box>
    );
  }

  if (error) console.error(`Error getting cateogires ${error}`);

  const { categories } = data;

  const onSubmit = async ({ name }, e) => {
    await createCategory({
      variables: { name, authorId },
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({
          query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
          variables: { authorId }
        });

        const newCategory = data['insert_categories_one'];

        newCategory.name = name;
        newCategory.authorId = authorId;

        const sortedCategories = [
          newCategory,
          ...cacheData.categories
        ].sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        );

        cache.writeQuery({
          query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
          variables: { authorId },
          data: {
            categories: sortedCategories
          }
        });
      }
    });
    toast({
      title: 'Category created.',
      description: `We've created the ${name} Category for you.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top'
    });
    e.target.reset();
  };

  const onDeleteCategory = async (id, name) => {
    await deleteCategory({
      variables: { id },
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({
          query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
          variables: { authorId: user?.uid }
        });

        const deletedCat = data['delete_categories_by_pk'];

        const updatedCategories = cacheData.categories.filter(
          category => category.id !== deletedCat.id
        );

        cache.writeQuery({
          query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
          variables: { authorId: user?.uid },
          data: {
            categories: updatedCategories
          }
        });
      }
    });
    toast({
      title: 'Category deleted.',
      description: `We've deleted the ${name} Category for you.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top'
    });
  };

  return (
    <Box h="100vh" backgroundColor="gray.100">
      <Header active="categories" />
      <Flex flexDirection="column" maxW="1250px" margin="0 auto">
        <Flex
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          ml={8}
          mb={4}
          maxW="500px"
        >
          <FormControl>
            <Input
              name="name"
              placeholder="Javascript"
              ref={register({ required: true })}
              backgroundColor="white"
            />
          </FormControl>
          <Button
            backgroundColor="gray.900"
            color="white"
            fontWeight="medium"
            _hover={{ bg: 'gray.700' }}
            _active={{ transform: 'scale(0.95)', bg: 'gray.800' }}
            type="submit"
            pl={8}
            pr={8}
            ml={3}
            isLoading={creatingCategory}
          >
            + Add Category
          </Button>
        </Flex>
        <Box px={9} pt={4}>
          <List spacing={3}>
            {categories.map(({ name, id }) => (
              <ListItem key={id} display="flex" alignItems="center">
                {name}{' '}
                <Tooltip label="Delete Category" fontSize="xs">
                  <DeleteIcon
                    color="red.500"
                    ml={2}
                    onClick={() => onDeleteCategory(id, name)}
                    cursor="pointer"
                    _active={{ transform: 'scale(0.95)' }}
                  />
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Flex>
    </Box>
  );
};

export default Categories;
