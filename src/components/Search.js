import React, { useState } from 'react';
import { array, func } from 'prop-types';
import { Button, Select, Input } from 'semantic-ui-react';

Search.propTypes = {
    cols: array.isRequired,
    onSearchClick: func.isRequired
};

export default function Search({ cols, onChange, onSearchClick }) {

    const [searchOption, setSearchOption] = useState(cols[0].id);
    const [searchText, setSearchText] = useState(undefined);

    const searchOptions = cols.map(col => ({ key: col.id, text: col.title, value: col.id }));

    return (
        <Input type="text" placeholder="Rechercher..." action onChange={(_e, { value }) => { setSearchText(value); onChange(); }}>
            <input />
            <Select compact options={searchOptions} defaultValue={cols[0].id} onChange={(_e, { value }) => { setSearchOption(value); onChange(); }} />
            <Button onClick={ () => onSearchClick(searchText, searchOption) }><i aria-hidden="true" className="search icon"></i></Button>
        </Input>
    );
}