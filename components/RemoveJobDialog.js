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

// Hooks
import { useAuth } from '@/hooks/hooks';

// GraphQL
import { DELETE_JOB_BY_ID_MUTATION } from '@/graphql/mutations';
import { GET_JOBS_BY_AUTHOR_QUERY } from '@/graphql/queries';

// S3
import { s3 } from '@/lib/aws.config';

export default function RemoveJobDialog({ id, imageUrl }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const [deleteJob, { loading }] = useMutation(DELETE_JOB_BY_ID_MUTATION);
  const cancelRef = useRef();
  const toast = useToast();

  const onDeleteJob = async () => {
    if (imageUrl) {
      const [, , , folder, fileName] = decodeURIComponent(imageUrl).split('/');

      const params = {
        Bucket: 'nextjs-job-post',
        Key: `${folder}/${fileName}`
      };

      s3.deleteObject(params, err => {
        if (err) {
          console.error(`Error deleting image: ${err}`);
        }
      });
    }

    await deleteJob({
      variables: { id },
      update: cache => {
        const cacheData = cache.readQuery({
          query: GET_JOBS_BY_AUTHOR_QUERY,
          variables: { authorId: user.id }
        });

        const updatedJobs = cacheData.jobs.filter(job => job.id !== id);

        cache.writeQuery({
          query: GET_JOBS_BY_AUTHOR_QUERY,
          variables: { authorId: user.id },
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
              {`Are you sure? You can't undo this action afterwards.`}
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
