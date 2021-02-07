import { DeleteIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  chakra,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast
} from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';

import { DELETE_CATEGORY_BY_ID_MUTATION } from '@/graphql/mutations';
import { GET_CATEGORIES_BY_AUTHOR_ID_QUERY } from '@/graphql/queries';
import { useMutation } from '@apollo/client';
import { useAuth } from '@/lib/auth';
import EditCategoryModal from './EditCategoryModal';

export default function CategoriesTable({ categories = [] }) {
  const { user } = useAuth();
  const authorId = user?.uid;
  const data = useMemo(
    () =>
      categories.map(({ id, name }) => ({
        col1: name,
        col2: <EditCategoryModal categoryName={name} categoryId={id} />,
        col3: (
          <Tooltip label="Delete Category" fontSize="xs">
            <DeleteIcon
              color="red.500"
              ml={6}
              onClick={() => onDeleteCategory(id, name)}
              cursor="pointer"
              _active={{ transform: 'scale(0.95)' }}
              _hover={{ color: 'red.300' }}
            />
          </Tooltip>
        )
      })),
    [categories]
  );

  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'col1' },
      { Header: '', accessor: 'col2' },
      { Header: '', accessor: 'col3' }
    ],
    []
  );

  const [deleteCategory] = useMutation(DELETE_CATEGORY_BY_ID_MUTATION);
  const toast = useToast();

  const onDeleteCategory = async (id, name) => {
    await deleteCategory({
      variables: { id },
      update: (cache, { data }) => {
        const cacheData = cache.readQuery({
          query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
          variables: { authorId }
        });

        const deletedCat = data['delete_categories_by_pk'];

        const updatedCategories = cacheData.categories.filter(
          category => category.id !== deletedCat.id
        );

        cache.writeQuery({
          query: GET_CATEGORIES_BY_AUTHOR_ID_QUERY,
          variables: { authorId },
          data: {
            categories: updatedCategories
          }
        });
      }
    });
    toast({
      title: 'Category deleted.',
      description: `We've deleted the ${name} Category for you.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top'
    });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data }, useSortBy);

  return (
    <>
      <Table {...getTableProps()} variant="striped" colorScheme="gray" mb={2}>
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    borderBottom: 'solid 1px #E2E8F0',
                    background: '#F7FAFC',
                    color: 'black',
                    fontWeight: 'bold'
                  }}
                >
                  {column.render('Header')}
                  <chakra.span pl="4">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon aria-label="sorted descending" />
                      ) : (
                        <TriangleUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
}
