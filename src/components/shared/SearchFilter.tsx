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
      padding: 11px 16px;
      width: 100%;

      > .icon {
        font-size: 18px;
        margin-left: auto;
      }
    }
  }

  .equity {
    position: relative;
    button {
      background-color: #fff;

      .icon {
        height: 17px;
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
    padding: 0px 0px 0px 16px;
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

const EquityMenu: FC<any> = ({ equityOption, setEquityOption, onUpdate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleEquityToggle = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleEquityClose = () => setAnchorEl(null);

  return (
    <div className="dropdown-button equity">
      <Button onClick={handleEquityToggle} id="equity-btn" key="equity-btn">
        <img className="icon" src={equityOption.icon} />
      </Button>
      <StyledMenu
        keepMounted
        disableEnforceFocus
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={handleEquityClose}
        open={Boolean(anchorEl)}
      >
        {equityOptions?.map((option, index) => (
          <MenuItem
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
  );
};

const SearchFilter: FC<SearchFilterProps> = ({
  dropdownOptions,
  showDropdown = false,
  updateFilterFields,
  label,
  ...rest
}) => {
  const [selectedOption, setSelectedOption] = useState<DropdownOption>((dropdownOptions ?? [])[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);

  const [equityOption, setEquityOption] = useState<any>(equityOptions[0]);

  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = '';
  }, [label]);

  const onUpdate = ({
    updatedOption = selectedOption,
    equity = equityOption,
  }: {
    updatedOption?: DropdownOption;
    equity?: any;
  }) => {
    const searchFilterFields = inputRef?.current?.value
      ? [
          {
            field: updatedOption.field,
            op: equity.value,
            values: [inputRef.current.value],
          },
        ]
      : [];
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
        onChange={debounce(() => {
          onUpdate({});
        }, 500)}
        ref={inputRef}
        afterElementWithoutError
        AfterElement={() => (
          <EquityMenu
            equityOption={equityOption}
            setEquityOption={setEquityOption}
            onUpdate={onUpdate}
          />
        )}
      />
    </Wrapper>
  );
};

export default SearchFilter;
