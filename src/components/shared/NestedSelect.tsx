import React, { FC, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { NavigateBefore, NavigateNext, Search } from '@material-ui/icons';
import { StylesConfig } from 'react-select';
import Select, { SelectProps } from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { get } from 'lodash';
import { Pageable } from '#utils/globalTypes';
import { Select as CustomSelect } from './Select';

const PopOutWrapper = styled.div.attrs({
  className: 'popout-wrapper',
})`
  padding-inline: 4px;
  border-top: 1px solid #f4f4f4;
`;

const NestedOption = styled.div<{ isBack?: boolean; isForward?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${(p) => (p.isBack ? '12px 24px' : '10px 12px')};
  margin-inline: ${(p) => (p.isBack ? 'unset' : '12px')};
  justify-content: ${(p) => (p.isForward ? 'space-between' : 'unset')};
  font-weight: ${(p) => (p.isBack ? 'bold' : '400')};
  border-bottom: 1px solid #e0e0e0;
  svg {
    font-size: ${(p) => (p.isBack ? '20px !important' : '16px')};
    margin-inline: ${(p) => (p.isBack ? '0 16px' : '16px 0')};
    color: #161616;
  }
`;

const StyledSelect = styled(Select)<{ width: string }>`
  width: ${(p) => p.width};
  .MuiMenuItem-root {
    padding: unset !important;
  }
  .MuiInputBase-input {
    padding: 0px;
  }
`;

const selectStyles: StylesConfig<any> = {
  control: (provided) => ({
    ...provided,
    minWidth: 240,
    margin: 8,
    borderRadius: 0,
    backgroundColor: '#f4f4f4',
  }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
};

const useSelectStyles = makeStyles({
  icon: {
    display: 'none',
  },
  styles: {
    '&:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
  },

  select: {
    paddingRight: 'unset !important',
    '&:focus': {
      backgroundColor: 'unset',
    },
  },
});

const useMenuStyles = makeStyles({
  paper: {
    borderRadius: 0,
  },
  styles: {
    '.MuiMenuItem-root': {
      padding: '0 !important',
    },
  },
});

const DropdownIndicator = () => <Search />;

type PopOutProps = {
  handleMenuScrollToBottom: () => void;
  selectOptions: ItemType[];
  onInputChange: (newValue: string) => void;
} & Pick<NestedSelectProps, 'onChildChange'>;

type NestedSelectProps = {
  items: ItemsType;
  label: (value: unknown) => React.ReactNode;
  onChildChange: (option: any) => void;
  width?: string;
  id: string;
} & SelectProps;

type State = {
  parentPath: string[];
  options: ItemType[];
  selectOptions: ItemType[];
  isLoading: boolean;
  openPopOut: boolean;
  openSelect: boolean;
};

type ItemType = {
  label: string;
  items?: ItemsType;
  fetchItems?: (
    pageNumber?: number,
    query?: string,
  ) => Promise<{ options: ItemType[]; pageable?: Pageable }>;
  value?: string;
};

type ItemsType = Record<string, ItemType>;

type MenuTreeProps = {
  items: ItemsType;
  onChildChange: NestedSelectProps['onChildChange'];
  state: State;
  parent: React.MutableRefObject<ItemType | null>;
  pagination: React.MutableRefObject<Pageable>;
  setState: React.Dispatch<React.SetStateAction<State>>;
};

const initialState: State = {
  parentPath: [],
  options: [],
  selectOptions: [],
  isLoading: false,
  openPopOut: false,
  openSelect: false,
};

const initialPagination = {
  page: -1,
  pageSize: 10,
  numberOfElements: 0,
  totalPages: 0,
  totalElements: 0,
  first: true,
  last: true,
  empty: true,
};

const PopOut: FC<PopOutProps> = ({
  handleMenuScrollToBottom,
  selectOptions,
  onChildChange,
  onInputChange,
}) => {
  const [inputValue, setInputValue] = useState<string | undefined>();

  useEffect(() => {
    if (typeof inputValue === 'string') {
      onInputChange(inputValue);
    }
  }, [inputValue]);

  return (
    <PopOutWrapper onKeyDown={(e) => e.stopPropagation()}>
      <CustomSelect
        autoFocus
        backspaceRemovesValue={false}
        components={{ DropdownIndicator, IndicatorSeparator: null }}
        controlShouldRenderValue={false}
        hideSelectedOptions={false}
        menuIsOpen
        onChange={(newValue) => {
          onChildChange(newValue);
        }}
        options={selectOptions}
        placeholder="Search..."
        inputValue={inputValue}
        styles={selectStyles}
        tabSelectsValue={false}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        onInputChange={(value) => setInputValue(value)}
      />
    </PopOutWrapper>
  );
};

const MenuTree: FC<MenuTreeProps> = ({
  items,
  onChildChange,
  state,
  parent,
  pagination,
  setState,
}) => {
  const { parentPath, options, isLoading, selectOptions, openPopOut } = state;

  const getItems = async (fn: ItemType['fetchItems']) => {
    if (fn) {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { options: awaitedOptions, pageable } = await fn(pagination.current.page);
      if (pageable) {
        pagination.current = pageable;
      }
      setState((prev) => ({
        ...prev,
        isLoading: false,
        selectOptions: [...prev.selectOptions, ...awaitedOptions],
      }));
    }
  };

  const onInputChange = async (value: string) => {
    if (parent.current?.fetchItems) {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { options: awaitedOptions, pageable } = await parent.current.fetchItems(
        initialPagination.page,
        value,
      );
      if (pageable) {
        pagination.current = pageable;
      }
      setState((prev) => ({
        ...prev,
        isLoading: false,
        selectOptions: awaitedOptions,
      }));
    }
  };

  useEffect(() => {
    let nodes = items;
    let updatedParent: any = undefined;
    let updatedOpenPopOut = false;
    if (parentPath.length) {
      updatedParent = { ...get(items, parentPath, {}) };
      if (updatedParent.fetchItems) {
        getItems(updatedParent.fetchItems);
        updatedOpenPopOut = true;
      }
      nodes = {
        back: { label: updatedParent.label },
        ...(updatedParent?.items || {}),
      };
    }

    parent.current = updatedParent;

    setState((prev) => {
      return {
        ...prev,
        options: Object.entries(nodes).map(([key, value]: [string, any]) => ({
          ...value,
          label: value.label,
          value: key,
        })),
        openPopOut: updatedOpenPopOut,
      };
    });
  }, [parentPath]);

  const handleMenuScrollToBottom = () => {
    if (!isLoading && !pagination.current.last && parent.current?.fetchItems) {
      getItems(parent.current.fetchItems);
    }
  };

  const displayLabel = (currOption: ItemType) => {
    if (currOption.value === 'back') {
      return (
        <NestedOption isBack>
          <NavigateBefore />
          {currOption.label}
        </NestedOption>
      );
    }

    if (currOption.items || currOption.fetchItems) {
      return (
        <NestedOption isForward>
          {currOption.label}
          <NavigateNext />
        </NestedOption>
      );
    }
    return <NestedOption>{currOption.label}</NestedOption>;
  };

  return (
    <>
      {options?.map((currOption, index) => (
        <>
          <MenuItem
            key={index}
            onClick={() => {
              if (currOption.value === 'back') {
                pagination.current = initialPagination;
                setState((prev) => ({
                  ...prev,
                  parentPath: prev.parentPath.filter((v, i) => i < prev.parentPath.length - 2),
                  selectOptions: [],
                }));
              } else if (currOption?.items || currOption?.fetchItems) {
                setState((prev) => ({
                  ...prev,
                  parentPath: [
                    ...prev.parentPath,
                    ...(prev.parentPath.length ? ['items'] : []),
                    ...(currOption?.value ? [currOption.value] : []),
                  ],
                }));
              } else {
                onChildChange(currOption);
              }
            }}
          >
            {displayLabel(currOption)}
          </MenuItem>
        </>
      ))}
      {openPopOut && (
        <PopOut
          handleMenuScrollToBottom={handleMenuScrollToBottom}
          selectOptions={selectOptions}
          onChildChange={onChildChange}
          onInputChange={onInputChange}
        />
      )}
    </>
  );
};

export const NestedSelect: FC<NestedSelectProps> = ({
  items,
  onChildChange,
  label,
  width = 'auto',
  id,
  ...rest
}) => {
  const selectClasses = useSelectStyles();
  const menuClasses = useMenuStyles();
  const [state, setState] = useState<State>(initialState);
  const parent = useRef<ItemType | null>(null);
  const pagination = useRef<Pageable>(initialPagination);
  const { openSelect } = state;

  const handleOnChildChange = (option: any) => {
    onChildChange(option);
    onClose();
  };

  const onClose = () => {
    setState((prev) => ({
      ...prev,
      openSelect: false,
    }));
    setTimeout(() => {
      setState(initialState);
    }, 200);
  };

  return (
    <StyledSelect
      id={id}
      width={width}
      MenuProps={{
        disableEnforceFocus: true,
        classes: { paper: menuClasses.paper },
        className: menuClasses.styles,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        container: document.getElementById(id),
        ...rest.MenuProps,
      }}
      displayEmpty
      classes={{
        icon: selectClasses.icon,
        select: selectClasses.select,
      }}
      className={selectClasses.styles}
      renderValue={label}
      open={openSelect}
      onOpen={() => setState((prev) => ({ ...prev, openSelect: true }))}
      onClose={onClose}
      {...rest}
    >
      <MenuTree
        items={items}
        onChildChange={handleOnChildChange}
        state={state}
        pagination={pagination}
        parent={parent}
        setState={setState}
      />
    </StyledSelect>
  );
};
