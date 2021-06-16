import React, { useState, useContext, createContext } from 'react';

const SearchContext = createContext(null);

function useProvideSearch() {
  const [search, setSearch] = useState('');

  const onSearch = e => {
    e.preventDefault();

    const searchValue = e.target.value;

    setSearch(searchValue);
    return searchValue;
  };

  return {
    onSearch,
    search,
    setSearch
  };
}

export const useSearch = () => useContext(SearchContext);

export function ProvideSearch({ children }) {
  const search = useProvideSearch();

  return (
    <SearchContext.Provider value={search}>{children}</SearchContext.Provider>
  );
}
