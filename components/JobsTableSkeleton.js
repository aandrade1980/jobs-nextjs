import { Skeleton, Box } from '@chakra-ui/react';
import { Table, Td, Th, Tr } from './Table';

const SkeletonRow = ({ width }) => (
  <Box as="tr">
    <Td>
      <Skeleton height="10px" w={width} my={4} />
    </Td>
    <Td>
      <Skeleton height="10px" w={width} my={4} />
    </Td>
    <Td>
      <Skeleton height="10px" w={width} my={4} />
    </Td>
    <Td>
      <Skeleton height="10px" w={width} my={4} />
    </Td>
  </Box>
);

const JobsTableSkeleton = () => (
  <Table>
    <thead>
      <Tr>
        <Th>Title</Th>
        <Th>Company</Th>
        <Th>Email</Th>
        <Th>Date Posted</Th>
        <Th>{''}</Th>
      </Tr>
    </thead>
    <tbody>
      <SkeletonRow width="75px" />
      <SkeletonRow width="125px" />
      <SkeletonRow width="50px" />
      <SkeletonRow width="100px" />
      <SkeletonRow width="75px" />
    </tbody>
  </Table>
);

export default JobsTableSkeleton;
