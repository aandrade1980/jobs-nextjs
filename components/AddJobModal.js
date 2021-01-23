import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Grid,
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
import { s3 } from '@/lib/aws.config';

import { CREATE_JOB_MUTATION } from '@/graphql/mutations';
import {
  ALL_CATEGORIES_QUERY,
  GET_JOBS_BY_AUTHOR_QUERY
} from '@/graphql/queries';
import { useAuth } from '@/lib/auth';

function AddJobModal() {
  const { user } = useAuth();
  const [createJob, { loading: loadingJobs }] = useMutation(
    CREATE_JOB_MUTATION
  );
  const [allCategories, { data: categoriesQueryData }] = useLazyQuery(
    ALL_CATEGORIES_QUERY
  );
  const { register, handleSubmit } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const openModal = () => {
    allCategories();
    onOpen();
  };

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
    categoriesIds,
    image
  }) => {
    let imageUrl = null;

    if (image.length) {
      const file = image[0];
      const fileName = file.name;
      const filePath = `jobs-images/${fileName}`;

      const result = await s3
        .upload({
          Key: filePath,
          Body: file,
          ACL: 'public-read'
        })
        .promise();

      imageUrl = result.Location;
    }

    const parsedCategoriesIds = parseCategoriesIds(categoriesIds);

    await createJob({
      variables: {
        title,
        company,
        email,
        postedDate: new Date(postedDate),
        description,
        categoriesIds: parsedCategoriesIds,
        authorId: user.uid,
        imageUrl
      },
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({
          query: GET_JOBS_BY_AUTHOR_QUERY,
          variables: { authorId: user.uid }
        });

        const newJob = data['insert_jobs'].returning[0];

        cache.writeQuery({
          query: GET_JOBS_BY_AUTHOR_QUERY,
          variables: { authorId: user.uid },
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
        onClick={openModal}
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

            <FormControl mt={3}>
              <FormLabel>Company</FormLabel>
              <Input
                placeholder="Facebook"
                name="company"
                ref={register({ required: true })}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Email</FormLabel>
              <Input placeholder="john@email.com" name="email" ref={register} />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Date Posted</FormLabel>
              <Input type="date" name="postedDate" ref={register} />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Categories</FormLabel>
              <CheckboxGroup>
                <Grid templateColumns="repeat(3, 1fr)">
                  {categoriesQueryData?.categories.map(({ id, name }) => (
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
                </Grid>
              </CheckboxGroup>
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                placeholder="We are looking for a ninja developer..."
                ref={register}
              />
            </FormControl>

            <FormControl mt={3}>
              <input type="file" id="image" ref={register} name="image" />
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
