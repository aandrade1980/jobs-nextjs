import { CloseIcon, Search2Icon } from '@chakra-ui/icons';
import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { useRef } from 'react';

import { useSearch } from '@/util/search';

import AddJobModal from './AddJobModal';

export const JobsTableHeader = () => {
  const { onSearch, search, setSearch } = useSearch();
  const inputRef = useRef();

  const handleClick = () => {
    setSearch('');
    inputRef.current.focus();
  };

  return (
    <Flex justifyContent="space-between" mb={4}>
      <InputGroup maxWidth="60%">
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.400" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search Jobs by Title or Company"
          backgroundColor="white"
          onChange={onSearch}
          value={search}
          ref={inputRef}
          borderColor="#CBD5E0"
        />
        <InputRightElement cursor="pointer" onClick={handleClick}>
          {search && <CloseIcon color="gray.400" />}
        </InputRightElement>
      </InputGroup>
      <AddJobModal buttonText="Add Job" title="Add Job" />
    </Flex>
  );
};
