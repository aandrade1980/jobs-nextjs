import { useMutation } from '@apollo/client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';

import { DELETE_JOB_BY_ID_MUTATION } from '@/graphql/mutations';
import { GET_JOBS_BY_AUTHOR_QUERY } from '@/graphql/queries';
import { useAuth } from '@/lib/auth';

export default function RemoveJobDialog({ id }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const [deleteJob, { loading }] = useMutation(DELETE_JOB_BY_ID_MUTATION);
  const cancelRef = useRef();
  const toast = useToast();

  const onDeleteJob = async () => {
    await deleteJob({
      variables: { id },
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({
          query: GET_JOBS_BY_AUTHOR_QUERY,
          variables: { authorId: user.uid }
        });

        const updatedJobs = cacheData.jobs.filter(job => job.id !== id);

        cache.writeQuery({
          query: GET_JOBS_BY_AUTHOR_QUERY,
          variables: { authorId: user.uid },
          data: {
            jobs: [...updatedJobs]
          }
        });
      }
    });

    toast({
      title: 'Job deleted.',
      description: 'The Job has been deleted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top'
    });
  };

  return (
    <>
      <IconButton
        aria-label="Delete feedback"
        icon={<DeleteIcon />}
        onClick={() => setIsOpen(true)}
        colorScheme="red"
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Job
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onDeleteJob}
                ml={3}
                isLoading={loading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
