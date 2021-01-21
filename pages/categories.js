import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { ALL_CATEGORIES_QUERY } from '@/graphql/queries';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  List,
  ListIcon,
  ListItem
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { CheckCircleIcon } from '@chakra-ui/icons';

import Header from '@/components/Header';
import { CREATE_CATEGORY_MUTATION } from '@/graphql/mutations';

const Categories = () => {
  const { loading, error, data } = useQuery(ALL_CATEGORIES_QUERY);
  const [createCategory, { loading: creatingCategory }] = useMutation(
    CREATE_CATEGORY_MUTATION
  );
  const { register, handleSubmit } = useForm();

  if (loading) {
    return (
      <Box h="100vh" backgroundColor="gray.100">
        <Header />
        <Box px={8}>Loading Categories...</Box>
      </Box>
    );
  }

  if (error) console.error(`Error getting cateogires ${error}`);

  const { categories } = data;

  const onSubmit = async ({ name }, e) => {
    await createCategory({
      variables: { name },
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({
          query: ALL_CATEGORIES_QUERY
        });

        const newCategory = data['insert_categories_one'];

        cache.writeQuery({
          query: ALL_CATEGORIES_QUERY,
          data: {
            ...cacheData,
            categories: [newCategory, ...cacheData.categories]
          }
        });
      }
    });

    e.target.reset();
  };

  return (
    <Box h="100vh" backgroundColor="gray.100">
      <Header />
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
            <ListItem key={id}>
              <ListIcon as={CheckCircleIcon} color="gray.500" />
              {name}
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Categories;
