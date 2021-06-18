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
  Switch,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { s3 } from '@/lib/aws.config';
import { useState } from 'react';

import {
  CREATE_JOB_MUTATION,
  UPDATE_JOB_BY_ID_MUTATION
} from '@/graphql/mutations';
import {
  GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
  GET_JOB_BY_ID_QUERY,
  GET_JOBS_BY_AUTHOR_QUERY
} from '@/graphql/queries';
import { useAuth } from '@/lib/auth';

function AddJobModal({ buttonText, title, job }) {
  const { user } = useAuth();
  const authorId = user?.uid;
  const [creatingJob, setCreatingJob] = useState(false);
  const [createJob] = useMutation(CREATE_JOB_MUTATION);
  const [updateJob] = useMutation(UPDATE_JOB_BY_ID_MUTATION, {
    variables: { id: job?.id }
  });
  const [getCategoriesByAuthor, { data: categoriesQueryData }] = useLazyQuery(
    GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
    {
      variables: { authorId }
    }
  );
  const { control, register, handleSubmit } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [requestSent, setRequestSent] = useState(job?.requestSent || false);

  const openModal = () => {
    getCategoriesByAuthor();
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
    setCreatingJob(true);

    const parsedCategoriesIds = parseCategoriesIds(categoriesIds);

    if (job) {
      try {
        await updateJob({
          variables: {
            _eq: job.id,
            categoriesIds: parsedCategoriesIds,
            company,
            description,
            email,
            postedDate,
            requestSent,
            title
          },
          update: (cache, { data: { update_jobs } }) => {
            cache.writeQuery({
              query: GET_JOB_BY_ID_QUERY,
              variables: { id: job.id },
              data: {
                jobs_by_pk: update_jobs.returning[0]
              }
            });
          }
        });
      } catch (error) {
        // TODO: add a error Toast
        console.log(`Error updating job: ${error}`);
      }
    } else {
      let imageUrl = null;
      let file, fileName, filePath;

      if (image.length) {
        file = image[0];
        fileName = file.name;
        filePath = `${encodeURIComponent(title)}-${Date.now()}/${fileName}`;

        imageUrl = `${
          process.env.NEXT_PUBLIC_AWS_BUCKET_URL
        }/${encodeURIComponent(filePath)}`;
      }

      try {
        await Promise.all([
          image.length
            ? s3
                .upload({ Key: filePath, Body: file, ACL: 'public-read' })
                .promise()
            : null,
          createJob({
            variables: {
              authorId,
              categoriesIds: parsedCategoriesIds,
              company,
              description,
              email,
              imageUrl,
              postedDate: new Date(postedDate),
              requestSent,
              title
            },
            update: (cache, { data }) => {
              const cacheData = cache.readQuery({
                query: GET_JOBS_BY_AUTHOR_QUERY,
                variables: { authorId }
              });

              const newJob = data['insert_jobs'].returning[0];

              cache.writeQuery({
                query: GET_JOBS_BY_AUTHOR_QUERY,
                variables: { authorId },
                data: {
                  ...cacheData,
                  jobs: [newJob, ...cacheData.jobs]
                }
              });
            }
          })
        ]);
      } catch (error) {
        // TODO: add a error Toast
        console.log('Error creating job: ', error);
      }
    }

    setCreatingJob(false);
    onClose();
    const status = `${job ? 'updated' : 'created'}`;
    toast({
      title: `Job ${status}.`,
      description: `We've ${status} your Job for you.`,
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
        leftIcon={job ? <EditIcon /> : <AddIcon w={3} h={3} />}
      >
        {buttonText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Controller
                as={<Input />}
                control={control}
                name="title"
                placeholder="React Dev"
                defaultValue={job?.title || ''}
                rules={{ required: true }}
              />
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Company</FormLabel>
              <Controller
                as={<Input />}
                control={control}
                name="company"
                placeholder="Facebook"
                defaultValue={job?.company || ''}
                rules={{ required: true }}
              />
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Email</FormLabel>
              <Controller
                as={<Input />}
                control={control}
                name="email"
                placeholder="john@email.com"
                defaultValue={job?.email || ''}
              />
            </FormControl>
            <FormControl mt={3} display="grid" gridTemplateColumns="1fr 1fr">
              <FormLabel>Request Sent</FormLabel>
              <FormLabel>Date Posted</FormLabel>
              <Switch
                isChecked={requestSent}
                onChange={() => setRequestSent(!requestSent)}
                name="requestSent"
                ref={register}
                alignSelf="center"
              />
              <Controller
                as={<Input type="date" />}
                control={control}
                name="postedDate"
                defaultValue={
                  job?.postedDate || new Date().toISOString().slice(0, 10)
                }
              />
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Categories</FormLabel>

              <CheckboxGroup defaultValue={job?.categoriesIds}>
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
                defaultValue={job?.description || ''}
              />
            </FormControl>
            <FormControl mt={3}>
              <input
                type="file"
                id="image"
                ref={register}
                name="image"
                accept="image/*"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              backgroundColor="#0AF5F4"
              ml={3}
              type="submit"
              isLoading={creatingJob}
            >
              {job ? 'Update' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddJobModal;
