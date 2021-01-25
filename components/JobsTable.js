import { Box, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import RemoveJobDialog from './RemoveJobDialog';
import { Table, Td, Th, Tr } from './Table';

const JobsTable = ({ jobs }) => (
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
      {jobs.map(({ id, title, company, postedDate, email, imageUrl }) => (
        <Box as="tr" key={id}>
          <Td fontWeight="medium">
            <NextLink href="/job/[jobId]" as={`/job/${id}`}>
              <Link>{title}</Link>
            </NextLink>
          </Td>
          <Td>{company}</Td>
          <Td>{email}</Td>
          <Td>{postedDate}</Td>
          <Td>
            <RemoveJobDialog id={id} imageUrl={imageUrl} />
          </Td>
        </Box>
      ))}
    </tbody>
  </Table>
);

export default JobsTable;
