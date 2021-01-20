import { useMutation } from '@apollo/client';
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
  useDisclosure
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { CREATE_JOB_MUTATION } from '@/graphql/mutations';
import { ALL_JOBS_QUERY } from '@/graphql/queries';

function AddJobModal() {
  const { register, handleSubmit } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createJob, { loading }] = useMutation(CREATE_JOB_MUTATION);

  const onSubmit = async ({ title, company, email, postedDate }) => {
    await createJob({
      variables: {
        title,
        company,
        email,
        postedDate: new Date(postedDate).toISOString()
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
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              backgroundColor="#0AF5F4"
              ml={3}
              type="submit"
              isLoading={loading}
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
