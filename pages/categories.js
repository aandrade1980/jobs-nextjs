import dynamic from 'next/dynamic';
import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import ErrorMessage from '@/components/ErrorMessage';

import { GET_CATEGORIES_BY_AUTHOR_ID_QUERY } from '@/graphql/queries';
import { CREATE_CATEGORY_MUTATION } from '@/graphql/mutations';
import { useCategoriesByAuthor } from '@/graphql/hooks';
import { useAuth } from '@/lib/auth';
import { MotionBox, MotionFlex } from '@/util/chakra-motion';
import { sortCategories } from '@/util/helpers';

// Components
import Header from '@/components/Header';
import Page from '@/components/Page';

// Dynamic Render
const CategoriesTableComponent = dynamic(() =>
  import('@/components/CategoriesTable')
);

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
        <Flex px={8} pt={8} justifyContent="center">
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

  if (error) console.error(`Error getting categories ${error}`);

  const { categories } = data;

  const onSubmit = async ({ name }, e) => {
    await createCategory({
      variables: { name, authorId },
      optimisticResponse: {
        insert_categories_one: {
          __typename: 'Categories',
          authorId,
          id: uuidv4(),
          name
        }
      },
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({
          query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
          variables: { authorId }
        });

        const newCategory = Object.assign({}, data['insert_categories_one']);

        newCategory.name = name;
        newCategory.authorId = authorId;
        newCategory.createdAt = new Date().toISOString().split('T')[0]; // Today Date in yyyy-mm--dd format

        const sortedCategories = sortCategories([
          newCategory,
          ...cacheData.categories
        ]);

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
    <Box minH="100vh" backgroundColor="gray.100">
      <Header active="categories" />
      <Flex as="main" maxW="1250px" margin="0 auto">
        <MotionBox
          ml={8}
          mb={2}
          px={9}
          width="fit-content"
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring' }}
        >
          <CategoriesTableComponent categories={categories} />
        </MotionBox>
        <MotionFlex
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          ml={8}
          mb={4}
          maxW="550px"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <FormControl>
            <Input
              name="name"
              placeholder="Javascript"
              ref={register({
                required: true,
                validate: alreadyExists
              })}
              borderColor="gray.400"
              backgroundColor="white"
              isInvalid={errors.name}
              errorBorderColor="red.500"
              focusBorderColor={errors.name ? 'red.500' : 'blue.500'}
            />
            {errors.name?.type === 'required' && (
              <ErrorMessage message="This is required" />
            )}
            {errors.name?.type === 'validate' && (
              <ErrorMessage message="Category already exists" />
            )}
          </FormControl>
          <Button
            backgroundColor="gray.900"
            color="white"
            fontWeight="medium"
            type="submit"
            px={8}
            ml={3}
            isLoading={creatingCategory}
            leftIcon={<AddIcon w={3} h={3} />}
            _hover={{ bg: 'gray.700' }}
            _active={{ transform: 'scale(0.95)', bg: 'gray.700' }}
          >
            Add Category
          </Button>
        </MotionFlex>
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
