import { ExpandMore } from '@material-ui/icons';
import React, { FC } from 'react';
import ReactSelect, { Props } from 'react-select';
import styled from 'styled-components';

export const formatOptionLabel: Props<{
  option: string;
  label: string;
  externalId: string;
}>['formatOptionLabel'] = ({ externalId, label }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
    <div>{label}</div>
    {externalId && <div>{externalId}</div>}
  </div>
);

type SelectProps = Props<any> & {
  error?: string;
  label?: string;
  optional?: boolean;
  style?: React.CSSProperties;
  formatOptionLabel?: Props<any>['formatOptionLabel'];
  filterProp?: string[];
};

const Wrapper = styled.div.attrs({
  className: 'react-custom-select',
})`
  .label {
    align-items: center;
    color: #525252;
    display: flex;
    font-size: 12px;
    justify-content: flex-start;
    letter-spacing: 0.16px;
    line-height: 1.29;
    margin-bottom: 8px;
  }

  .optional-badge {
    color: #999999;
    font-size: 12px;
    margin-left: 4px;
  }

  .MuiSvgIcon-root {
    color: #808ba5;
    height: 24px;
    width: 24px;
    margin: 6px 4px;

    &:hover {
      color: #101010;
    }
  }

  .field-error {
    color: #eb5757;
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
`;

export type Option = { label: string; value: string | number };

export const selectStyles: Props['styles'] = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: 'none',
    boxShadow: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    padding: '1.7px',
    minHeight: 'auto',
  }),

  multiValueRemove: (styles, { isDisabled }) => ({
    ...styles,
    display: isDisabled ? 'none' : styles.display,
  }),

  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected || isFocused ? '#f4f4f4' : '#ffffff',
    borderBottom: '1px solid #bababa',
    color: '#000000',
    cursor: 'pointer',
    padding: '10px 16px',
  }),

  menu: (styles) => ({
    ...styles,
    zIndex: 3,
    borderRadius: 'none',
  }),

  menuList: (styles) => ({
    ...styles,
    padding: 0,
  }),

  singleValue: (styles) => ({
    ...styles,
    color: 'hsl(0, 0%, 20%)',
  }),

  groupHeading: (styles) => ({
    ...styles,
    color: 'rgba(0,0,0,0.87)',
    fontSize: '80%',
  }),

  menuPortal: (styles) => ({ ...styles, zIndex: 9999 }),
};

const DropdownIndicator = () => <ExpandMore />;

export const Select: FC<SelectProps> = ({
  styles = selectStyles,
  optional = false,
  label = '',
  error = '',
  style = {},
  filterProp = [],
  components,
  ...rest
}) => {
  const _filterProp = [
    'label',
    ...filterProp,
    ...(rest?.options?.[0]?.externalId ? ['externalId'] : []),
  ];

  return (
    <Wrapper style={style}>
      {label && (
        <label className="label">
          {label} {optional && <span className="optional-badge">Optional</span>}
        </label>
      )}
      <ReactSelect
        classNamePrefix="custom-select"
        menuPlacement="auto"
        styles={styles}
        isClearable={optional}
        captureMenuScroll={true}
        formatOptionLabel={formatOptionLabel}
        components={{ DropdownIndicator, ...components }}
        filterOption={(option, inputValue) => {
          if (!inputValue) {
            return true;
          }
          let valid = false;
          _filterProp.every((key) => {
            if (
              typeof option?.data?.[key] === 'string' &&
              option?.data?.[key]?.toLowerCase()?.indexOf?.(inputValue.toLowerCase()) >= 0
            ) {
              valid = true;
              return false;
            }
            return true;
          });
          return valid;
        }}
        {...rest}
      />
      {error && <span className="field-error">{error}</span>}
    </Wrapper>
  );
};
