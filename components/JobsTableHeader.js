import { useSearch } from '@/util/search';
import { Search2Icon } from '@chakra-ui/icons';
import { Flex, InputGroup, InputLeftElement, Input } from '@chakra-ui/react';

import AddJobModal from './AddJobModal';

export const JobsTableHeader = () => {
  const { onSearch, search } = useSearch();
  return (
    <Flex justifyContent="space-between" mb={4}>
      <InputGroup maxWidth="60%">
        <InputLeftElement
          pointerEvents="none"
          children={<Search2Icon color="gray.400" />}
        />
        <Input
          type="text"
          placeholder="Search Jobs by Title or Company"
          backgroundColor="white"
          onChange={onSearch}
          value={search}
        />
      </InputGroup>
      <AddJobModal buttonText="Add Job" title="Add Job" />
    </Flex>
  );
};
