import React, { useState } from 'react';
import {
  shape, string, arrayOf, func,
} from 'prop-types';
import { Button, Select, Input } from 'semantic-ui-react';

const Search = ({ cols, onChange, onSearchClick }) => {
  const [searchOption, setSearchOption] = useState(cols[0].id);
  const [searchText, setSearchText] = useState(undefined);

  const searchOptions = cols.map(col => ({ key: col.id, text: col.title, value: col.id }));

  return (
    <Input
      type="text"
      placeholder="Rechercher..."
      action
      onChange={(_e, { value }) => { setSearchText(value); onChange(); }}
    >
      <input />
      <Select
        compact
        options={searchOptions}
        defaultValue={cols[0].id}
        onChange={(_e, { value }) => { setSearchOption(value); onChange(); }}
      />
      <Button
        type="button"
        onClick={() => onSearchClick(searchText, searchOption)}
      >
        <i aria-hidden="true" className="search icon" />
      </Button>
    </Input>
  );
};

Search.propTypes = {
  cols: arrayOf(shape({
    id: string.isRequired,
  })).isRequired,
  onSearchClick: func.isRequired,
  onChange: func.isRequired,
};

export default Search;
