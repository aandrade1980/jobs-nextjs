import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { CREATE_JOB_MUTATION } from '@/graphql/mutations';
import { ALL_CATEGORIES_QUERY, ALL_JOBS_QUERY } from '@/graphql/queries';

function AddJobModal() {
  const [createJob, { loading: loadingJobs }] = useMutation(
    CREATE_JOB_MUTATION
  );
  // TODO check is the categories are loading and if you get an error
  const { loading, error, data } = useQuery(ALL_CATEGORIES_QUERY);

  const { register, handleSubmit } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const parseCategoriesIds = (arrayCategoriesId = []) => {
    let queryObject = '{';

    arrayCategoriesId.forEach((category, index) => {
      queryObject = queryObject + category;

      if (index !== arrayCategoriesId.length - 1) {
        queryObject = queryObject + ',';
      }
    });

    queryObject = queryObject + '}';

    return queryObject;
  };

  const onSubmit = async ({
    title,
    company,
    email,
    postedDate,
    description,
    categoriesIds
  }) => {
    const parsedCategoriesIds = parseCategoriesIds(categoriesIds);

    await createJob({
      variables: {
        title,
        company,
        email,
        postedDate: new Date(postedDate),
        description,
        categoriesIds: parsedCategoriesIds
      },
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({
          query: ALL_JOBS_QUERY
        });

        const newJob = data['insert_jobs'].returning[0];

        cache.writeQuery({
          query: ALL_JOBS_QUERY,
          data: {
            ...cacheData,
            jobs: [newJob, ...cacheData.jobs]
          }
        });
      }
    });
    onClose();
    toast({
      title: 'Job created.',
      description: "We've created your Job for you.",
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top'
    });
  };

  return (
    <>
      <Button
        backgroundColor="gray.900"
        color="white"
        fontWeight="medium"
        _hover={{ bg: 'gray.700' }}
        _active={{ transform: 'scale(0.95)', bg: 'gray.800' }}
        onClick={onOpen}
      >
        + Add Job
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Add Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                placeholder="React dev"
                ref={register({ required: true })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Company</FormLabel>
              <Input
                placeholder="Facebook"
                name="company"
                ref={register({ required: true })}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input placeholder="john@email.com" name="email" ref={register} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Date Posted</FormLabel>
              <Input type="date" name="postedDate" ref={register} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Categories</FormLabel>
              <CheckboxGroup>
                <HStack>
                  {data?.categories.map(({ id, name }) => (
                    <Checkbox
                      key={id}
                      value={id}
                      borderColor="gray.300"
                      name="categoriesIds"
                      ref={register}
                    >
                      {name}
                    </Checkbox>
                  ))}
                </HStack>
              </CheckboxGroup>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="We are looking for a ninja developer..."
                ref={register}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              backgroundColor="#0AF5F4"
              ml={3}
              type="submit"
              isLoading={loadingJobs}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddJobModal;