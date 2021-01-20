import { Flex } from '@chakra-ui/react';
import AddJobModal from './AddJobModal';

export const JobsTableHeader = () => {
  return (
    <Flex justifyContent="flex-end" mb={4}>
      <AddJobModal />
    </Flex>
  );
};
