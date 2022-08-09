import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import { Autocomplete, AutocompleteRenderOptionState } from '@material-ui/lab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Control, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { debounce } from 'lodash';

const StyledTextField = styled(TextField)`
  .MuiInputLabel-formControl {
    transform: translate(20px, 14px) scale(1);
  }

  .MuiInputLabel-shrink {
    transform: translate(20px, 14px) scale(0);
    color: #000;
  }

  .MuiInputLabel-root {
    font-family: inherit;
    z-index: 1;
  }

  .MuiFormLabel-root.Mui-focused {
    color: rgba(0, 0, 0, 0.54);
  }

  .MuiInput-root {
    background-color: #f4f4f4;
    border: 1px solid transparent;
    border-bottom-color: #bababa;
    margin-top: 0px;
    font-family: inherit;

    .MuiAutocomplete-input {
      padding: 10px 16px !important;
      font-family: inherit;
    }
  }

  .MuiInput-underline:before {
    border: none;
  }

  && .MuiInput-underline:hover:before {
    border: none;
  }

  .MuiInput-underline:after {
    border: none;
  }
`;

export type fetchDataParams = {
  page: number;
  size?: number;
  query?: string;
};

type AutoCompletePropType = {
  control: Control<Record<string, any>>;
  label: string;
  name: string;
  fetchData: ({}: fetchDataParams) => void;
  choices: any[];
  currentPage: number;
  lastPage: boolean;
  rules?: Record<string, any>;
  getOptionLabel?: (option: any) => string;
  getOptionSelected?: (option: any, value: any) => boolean;
  onChange?: (data: any) => void;
  renderOption: (
    option: any,
    state: AutocompleteRenderOptionState,
  ) => React.ReactNode;
  loading?: boolean;
  optional?: boolean;
};

const Wrapper = styled.div`
  .input-label {
    align-items: center;
    color: #161616;
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    letter-spacing: 0.16px;
    line-height: 1.29;
    margin-bottom: 8px;

    .optional-badge {
      color: #999999;
      font-size: 12px;
      margin-left: 4px;
    }
  }
`;

export function AutoComplete({
  control,
  fetchData,
  choices,
  loading,
  currentPage,
  lastPage,
  rules = {},
  label,
  name,
  optional = false,
  getOptionLabel,
  getOptionSelected,
  renderOption,
  onChange
}: AutoCompletePropType) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData({ page: 0 });
  }, []);

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7 &&
      !lastPage
    ) {
      fetchData({
        page: currentPage + 1,
        query: '',
      });
    }
  };

  return (
    <Wrapper>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={(props) => (
          <>
            {label ? (
              <label className="input-label">
                {label}
                {optional ? (
                  <span className="optional-badge">Optional</span>
                ) : null}
              </label>
            ) : null}
            <Autocomplete
              {...props}
              id={`${name}-auto-complete`}
              open={open}
              options={choices}
              loading={loading}
              onChange={(_, data) => {
                props.onChange(data?.id);
                onChange && onChange(data);
              }}
              getOptionLabel={getOptionLabel}
              getOptionSelected={getOptionSelected}
              renderOption={renderOption}
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              ListboxProps={{
                style: { maxHeight: '250px' },
                onScroll: handleOnScroll,
              }}
              onInputChange={debounce((_, value) => {
                fetchData({
                  page: 0,
                  query: value,
                });
              }, 500)}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label={label}
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </>
        )}
      />
    </Wrapper>
  );
}
