import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { useRef } from 'react';

import { useMutation } from '@apollo/client';
import { useAuth } from '@/lib/auth';
import { GET_CATEGORIES_BY_AUTHOR_ID_QUERY } from '@/graphql/queries';
import { UPDATE_CATEGORY_MUTATION } from '@/graphql/mutations';
import { sortCategories } from '@/util/helpers';

import ErrorMessage from './ErrorMessage';

export default function EditCategoryModal({ categoryId, categoryName }) {
  const { user } = useAuth();
  const authorId = user?.uid;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [updateCategory] = useMutation(UPDATE_CATEGORY_MUTATION);
  const toast = useToast();
  const initialRef = useRef();

  return (
    <>
      <Tooltip label="Edit Category" fontSize="xs">
        <EditIcon cursor="pointer" color="blue.400" onClick={onOpen} />
      </Tooltip>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <Formik
          initialValues={{ name: categoryName }}
          validate={values => {
            const errors = {};
            if (!values.name) {
              errors.name = 'Required';
            }
            return errors;
          }}
          onSubmit={async (values, { setSubmitting }) => {
            await updateCategory({
              variables: { id: categoryId, name: values.name },
              optimisticResponse: {
                update_categories_by_pk: {
                  name: values.name,
                  id: categoryId,
                  authorId,
                  __typename: 'categories'
                }
              },
              update: (cache, { data }) => {
                const { categories } = cache.readQuery({
                  query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
                  variables: { authorId }
                });

                const updatedCategory = data['update_categories_by_pk'];

                const updatedCategoryIndex = categories.findIndex(
                  category => category.id === categoryId
                );

                const updatedCategories = [...categories];

                updatedCategories[updatedCategoryIndex] = updatedCategory;

                const sortedCategories = sortCategories(updatedCategories);

                cache.writeQuery({
                  query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
                  variables: { authorId },
                  data: {
                    categories: sortedCategories
                  }
                });
              }
            });
            setSubmitting(false);
            onClose();
            toast({
              title: 'Category updated.',
              description: `We've updated the ${categoryName} Category for you.`,
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top'
            });
          }}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <ModalContent as="form" onSubmit={handleSubmit}>
              <ModalHeader>Edit Category</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    ref={initialRef}
                    placeholder="React"
                    errorBorderColor="red.500"
                    focusBorderColor={errors.name ? 'red.500' : 'blue.500'}
                  />
                  <ErrorMessage message={errors.name} />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  colorScheme="blue"
                  ml={3}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update
                </Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Formik>
      </Modal>
    </>
  );
}
