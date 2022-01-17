import dynamic from 'next/dynamic';
import { DeleteIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  Flex,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast
} from '@chakra-ui/react';
import { Fragment, useMemo, useState } from 'react';
import { useTable, useSortBy, useFilters, usePagination } from 'react-table';

// Hooks
import { useAuth } from '@/hooks/hooks';
import { useMutation } from '@apollo/client';

// GraphQL
import { DELETE_CATEGORY_BY_ID_MUTATION } from '@/graphql/mutations';
import { GET_CATEGORIES_BY_AUTHOR_ID_QUERY } from '@/graphql/queries';

const EditCategoryModalComponent = dynamic(() => import('./EditCategoryModal'));

export default function CategoriesTable({ categories = [] }) {
  const { user } = useAuth();
  const authorId = user?.id;

  const TooltipComponent = ({ id, name }) => {
    return (
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
    );
  };

  const data = useMemo(
    () =>
      categories.map(({ id, name, createdAt }) => ({
        col1: name,
        col2: (
          <EditCategoryModalComponent
            categoryName={name}
            categoryId={id}
            createdAt={createdAt}
          />
        ),
        col3: <TooltipComponent id={id} name={name} />
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

  const [filterInput, setFilterInput] = useState('');

  const handleFilterChange = e => {
    const value = e.target.value || '';
    setFilter('col1', value);
    setFilterInput(value);
  };

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

  const onChangeInSelect = event => setPageSize(Number(event.target.value));

  const onChangeInInput = page => gotoPage(page - 1);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setFilter
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <Input
        type="text"
        value={filterInput}
        onChange={handleFilterChange}
        placeholder="Search Categories"
        size="sm"
        borderColor="gray.400"
        backgroundColor="gray.50"
        mb={2}
      />
      <Box border="solid 1px" borderColor="gray.300">
        <Table
          {...getTableProps()}
          variant="striped"
          colorScheme="gray"
          backgroundColor="gray.50"
          borderRadius="5px"
          minW="450px"
        >
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => (
                  <Fragment key={index}>
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
                  </Fragment>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr key={index} {...row.getRowProps()}>
                  {row.cells.map((cell, index) => (
                    <Td key={index} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      {!filterInput && (
        <Flex justifyContent="space-between" alignItems="center" mt={2}>
          <Button
            size="sm"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </Button>
          <Button size="sm" onClick={previousPage} disabled={!canPreviousPage}>
            {'<'}
          </Button>
          <Text fontSize="sm">
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </Text>
          <NumberInput
            size="sm"
            maxW={20}
            defaultValue={pageIndex + 1}
            min={1}
            max={pageOptions.length}
            onChange={valueString => onChangeInInput(valueString)}
            borderColor="gray.400"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Select
            size="sm"
            value={pageSize}
            onChange={onChangeInSelect}
            maxW="105px"
            borderColor="gray.400"
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
          <Button size="sm" onClick={nextPage} disabled={!canNextPage}>
            {'>'}
          </Button>
          <Button
            size="sm"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </Button>
        </Flex>
      )}
    </>
  );
}
