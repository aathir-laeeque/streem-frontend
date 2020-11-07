import { FilterField } from '#utils/globalTypes';
import { Menu, MenuItem } from '@material-ui/core';
import { ArrowDropDown, Search } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button1 } from './Button';
import { TextInput } from './Input';

const Wrapper = styled.div`
  display: flex;
  max-width: 500px;
  width: 500px;

  .dropdown-button {
    max-width: 200px;
    width: 200px;

    button {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      padding: 10px 16px;
      width: 100%;

      > .icon {
        font-size: 18px;
        margin-left: auto;
      }
    }
  }

  .search-filter-dropdown {
    .MuiMenu-list {
      background-color: #f4f4f4;
      padding: 0 10px;
    }

    &-item {
      border-bottom: 1px solid #dadada;

      :last-child {
        border: none;
      }
    }
  }

  .input-wrapper {
    padding: 9px 16px;

    .icon {
      font-size: 18px;
    }
  }
`;

type DropdownOption = {
  label: string;
  value: string;
  field: string;
  operator: string;
};

type SearchFilterProps = {
  showdropdown?: boolean;
  dropdownOptions?: DropdownOption[];
  updateFilterFields: (fields: FilterField[]) => void;
};

const SearchFilter: FC<SearchFilterProps> = ({
  dropdownOptions,
  showdropdown = false,
  updateFilterFields,
}) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption>(
    (dropdownOptions ?? [])[0],
  );

  const [searchValue, setSearchValue] = useState('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    const searchFilterFields: FilterField[] = [
      ...(selectedOption.field === 'name' ||
      selectedOption.field === 'checklist.name'
        ? [
            {
              field: selectedOption.field,
              op: selectedOption.operator,
              values: [searchValue],
            },
          ]
        : [
            {
              field: selectedOption.field,
              op: selectedOption.operator,
              values: [selectedOption.value],
            },
            {
              field: `${selectedOption.field.split('.')[0]}.value`,
              op: 'LIKE',
              values: [searchValue],
            },
          ]),
    ];

    updateFilterFields(searchFilterFields);
  }, [selectedOption, searchValue]);

  return (
    <Wrapper>
      {showdropdown ? (
        <div className="dropdown-button">
          <Button1 onClick={handleClick}>
            {selectedOption?.label} <ArrowDropDown className="icon" />
          </Button1>

          <Menu
            keepMounted
            anchorEl={anchorEl}
            id="search-filter-dropdown"
            onClose={handleClose}
            open={Boolean(anchorEl)}
            style={{ marginTop: 40 }}
          >
            {dropdownOptions?.map((option, index) => (
              <MenuItem
                className="search-filter-dropdown-item"
                key={index}
                onClick={() => {
                  setSelectedOption(option);
                  handleClose();
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      ) : null}
      <TextInput
        afterElementWithoutError
        AfterElement={Search}
        afterElementClass=""
        placeholder={`Search with ${selectedOption.label}`}
        defaultValue={searchValue}
        onChange={debounce(({ value }) => setSearchValue(value), 500)}
      />
    </Wrapper>
  );
};

export default SearchFilter;
