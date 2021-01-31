import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  List,
  Spinner,
  useToast
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import Header from '@/components/Header';
import DeleteCategory from '@/components/DeleteCategory';

import { GET_CATEGORIES_BY_AUTHOR_ID_QUERY } from '@/graphql/queries';
import { CREATE_CATEGORY_MUTATION } from '@/graphql/mutations';
import { useAuth } from '@/lib/auth';
import Page from '@/components/Page';
import { useCategoriesByAuthor } from '@/graphql/hooks';

const Categories = () => {
  const { user } = useAuth();
  const authorId = user?.uid;
  const { loading, error, data } = useCategoriesByAuthor(authorId);
  const [createCategory, { loading: creatingCategory }] = useMutation(
    CREATE_CATEGORY_MUTATION
  );

  const { register, handleSubmit, errors } = useForm();
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
      optimisticResponse: {
        insert_categories_one: {
          name,
          authorId,
          id: uuidv4(),
          __typename: 'Categories'
        }
      },
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

  const alreadyExists = categoryName =>
    categories.every(
      category => category.name.toLowerCase() !== categoryName.toLowerCase()
    );

  return (
    <Box h="100vh" backgroundColor="gray.100">
      <Header active="categories" />
      <Flex maxW="1250px" margin="0 auto" flexDirection="column">
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
              ref={register({
                required: true,
                validate: alreadyExists
              })}
              backgroundColor="white"
              isInvalid={errors.name}
              errorBorderColor="red.500"
              focusBorderColor={errors.name ? 'red.500' : 'blue.500'}
            />
            {/* use role="alert" to announce the error message */}
            {errors.name?.type === 'required' && (
              <Heading
                as="span"
                size="xs"
                role="alert"
                color="red.500"
                fontWeight="700"
                ml={1}
              >
                This is required
              </Heading>
            )}
            {errors.name?.type === 'validate' && (
              <Heading
                as="span"
                size="xs"
                role="alert"
                color="red.500"
                fontWeight="700"
                ml={1}
              >
                Category already exists
              </Heading>
            )}
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
        <Box px={9}>
          <List
            spacing={3}
            display="grid"
            gridTemplateColumns="auto auto"
            gridColumnGap="50px"
            alignItems="end"
            width="fit-content"
          >
            {categories.map(({ name, id }) => (
              <DeleteCategory key={id} name={name} id={id} />
            ))}
          </List>
        </Box>
      </Flex>
    </Box>
  );
};

const CategoriesPage = () => (
  <Page name="Categories" path="/categories">
    <Categories />
  </Page>
);

export default CategoriesPage;
