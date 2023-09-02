import { FilterField, FilterOperators } from '#utils/globalTypes';
import { MenuItem } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { TextInput } from './Input';
import { StyledMenu } from './StyledMenu';

const equityOptions = [
  {
    label: 'Contains',
    value: FilterOperators.LIKE,
    icon: '/images/contains.svg',
  },
  {
    label: 'Equals',
    value: FilterOperators.EQ,
    icon: '/images/equals.svg',
  },
];

const Wrapper = styled.div`
  display: flex;
  position: relative;

  .dropdown-button {
    max-width: 50px;
    width: 50px;

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

    .equity-dropdown-menu {
      .equity-dropdown-menu-item {
      }
    }
  }

  .equity {
    button {
      background-color: #fff;
      border: 1px solid #dadada;
      border-left: 0px;
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
    padding: 10px 16px;
    border-right: 0;
    .icon {
      font-size: 18px;
    }
  }
`;

type DropdownOption = {
  label: string;
  value: string;
  field: string;
  operator: FilterOperators;
};

type SearchFilterProps = {
  showDropdown?: boolean;
  dropdownOptions?: DropdownOption[];
  updateFilterFields: (fields: FilterField[]) => void;
  label: string;
} & React.HTMLAttributes<HTMLDivElement>;

const SearchFilter: FC<SearchFilterProps> = ({
  dropdownOptions,
  showDropdown = false,
  updateFilterFields,
  label,
  ...rest
}) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption>((dropdownOptions ?? [])[0]);
  // const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  const [equityOption, setEquityOption] = useState<any>(equityOptions[0]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

  const handleEquityToggle = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl1(event.currentTarget);

  const handleClose = () => setAnchorEl(null);
  const handleEquityClose = () => setAnchorEl1(null);

  useEffect(() => {
    // setSearchValue('');
    if (inputRef.current) inputRef.current.value = '';
  }, [label]);

  const onUpdate = ({
    updatedOption = selectedOption,
    equity = equityOption,
  }: {
    updatedOption?: DropdownOption;
    equity?: any;
  }) => {
    const updatedSearchValue = inputRef?.current?.value ?? '';
    const searchFilterFields = [
      ...(updatedOption.field === 'name' ||
      updatedOption.field === 'checklist.name' ||
      updatedOption.field === 'firstName' ||
      updatedOption.field === 'lastName' ||
      updatedOption.field === 'email' ||
      updatedOption.field === 'employeeId' ||
      updatedOption.field === 'code'
        ? [
            {
              field: updatedOption.field,
              op: equity.value,
              values: [updatedSearchValue],
            },
          ]
        : [
            {
              field: updatedOption.field,
              op: equity.value,
              values: [updatedOption.value],
            },
            {
              field: `${updatedOption.field.split('.')[0]}.value`,
              op: equity.value,
              values: [updatedSearchValue],
            },
          ]),
    ] as FilterField[];

    updateFilterFields(searchFilterFields);
  };

  return (
    <Wrapper {...rest}>
      {showDropdown ? (
        <div className="dropdown-button">
          <Button onClick={handleClick}>
            <ArrowDropDown className="icon" />
          </Button>

          <StyledMenu
            keepMounted
            disableEnforceFocus
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
                  onUpdate({
                    updatedOption: option,
                  });
                  handleClose();
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </StyledMenu>
        </div>
      ) : null}
      <TextInput
        placeholder={`Search ${showDropdown ? `with ${selectedOption?.label}` : ''}`}
        onChange={debounce(({ value }) => {
          // setSearchValue(value);
          onUpdate({});
        }, 500)}
        ref={inputRef}
      />
      <div className="dropdown-button equity">
        <Button onClick={handleEquityToggle}>
          <img className="icon" src={equityOption.icon} />
        </Button>

        <StyledMenu
          keepMounted
          disableEnforceFocus
          anchorEl={anchorEl1}
          className="equity-dropdown-menu"
          onClose={handleEquityClose}
          open={Boolean(anchorEl1)}
          style={{ marginTop: 40 }}
        >
          {equityOptions?.map((option, index) => (
            <MenuItem
              className="equity-dropdown-menu-item"
              key={index}
              onClick={() => {
                setEquityOption(option);
                onUpdate({
                  equity: option,
                });
                handleEquityClose();
              }}
            >
              <img src={option.icon} />
              {option.label}
            </MenuItem>
          ))}
        </StyledMenu>
      </div>
    </Wrapper>
  );
};

export default SearchFilter;
