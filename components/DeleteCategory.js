import React from 'react';
import { ListItem, Spinner, Tooltip, useToast } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { DeleteIcon } from '@chakra-ui/icons';

import { DELETE_CATEGORY_BY_ID_MUTATION } from '@/graphql/mutations';
import { GET_CATEGORIES_BY_AUTHOR_ID_QUERY } from '@/graphql/queries';
import { useAuth } from '@/lib/auth';

const DeleteCategory = ({ name, id }) => {
  const { user } = useAuth();
  const [deleteCategory, { loading }] = useMutation(
    DELETE_CATEGORY_BY_ID_MUTATION
  );
  const toast = useToast();

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
    <ListItem key={id} display="flex" alignItems="center">
      {loading ? (
        <Spinner color="red.500" />
      ) : (
        <>
          {name}{' '}
          <Tooltip label="Delete Category" fontSize="xs">
            <DeleteIcon
              color="red.500"
              ml={6}
              onClick={() => onDeleteCategory(id, name)}
              cursor="pointer"
              _active={{ transform: 'scale(0.95)' }}
              _hover={{ color: 'red.300' }}
            />
          </Tooltip>
        </>
      )}
    </ListItem>
  );
};

export default DeleteCategory;
