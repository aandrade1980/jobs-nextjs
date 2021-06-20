import { CheckIcon } from '@chakra-ui/icons';
import { Box, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

import { Table, Td, Th, Tr } from './Table';
import RemoveJobDialog from './RemoveJobDialog';

const JobsTable = ({ jobs }) => (
  <Table>
    <thead>
      <Tr>
        <Th>Title</Th>
        <Th>Company</Th>
        <Th>Date Posted</Th>
        <Th>Request Sent</Th>
        <Th>{''}</Th>
      </Tr>
    </thead>
    <tbody>
      {jobs.map(({ id, title, company, postedDate, requestSent, imageUrl }) => (
        <Box as="tr" key={id}>
          <Td fontWeight="medium">
            <NextLink href="/job/[jobId]" as={`/job/${id}`}>
              <Link>{title}</Link>
            </NextLink>
          </Td>
          <Td>{company}</Td>
          <Td>{postedDate}</Td>
          <Td>{requestSent && <CheckIcon color="green.500" w={5} h={5} />}</Td>
          <Td>
            <RemoveJobDialog id={id} imageUrl={imageUrl} />
          </Td>
        </Box>
      ))}
    </tbody>
  </Table>
);

export default JobsTable;
