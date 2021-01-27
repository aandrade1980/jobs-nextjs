import { Flex } from '@chakra-ui/react';
import AddJobModal from './AddJobModal';

export const JobsTableHeader = () => (
  <Flex justifyContent="flex-end" mb={4}>
    <AddJobModal buttonText="Add Job" title="Add Job" />
  </Flex>
);
