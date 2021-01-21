import { Box } from '@chakra-ui/react';
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
      {jobs.map(({ id, title, company, postedDate, email }) => (
        <Box as="tr" key={id}>
          <Td fontWeight="medium">{title}</Td>
          <Td>{company}</Td>
          <Td>{email}</Td>
          <Td>{postedDate}</Td>
          <Td>
            <RemoveJobDialog id={id} />
          </Td>
        </Box>
      ))}
    </tbody>
  </Table>
);

export default JobsTable;
