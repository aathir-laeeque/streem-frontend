import { ExpandMore } from '@material-ui/icons';
import React, { FC } from 'react';
import ReactSelect, { Props } from 'react-select';
import styled from 'styled-components';

export const formatOptionLabel: Props<{
  option: string;
  label: string;
  externalId: string;
}>['formatOptionLabel'] = ({ externalId, label }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div>{label}</div>
    {externalId && <div>{externalId}</div>}
  </div>
);

type SelectProps = Props & {
  error?: string;
  label?: string;
  optional?: boolean;
  style?: React.CSSProperties;
  formatOptionLabel?: any;
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
`;

export type Option = { label: string; value: string | number };

export const selectStyles: Props['styles'] = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: '#f4f4f4',
    border: 'none',
    borderBottom: '1px solid #bababa',
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

  singleValue: (styles, { isDisabled }) => ({
    ...styles,
    color: 'hsl(0, 0%, 20%)',
  }),

  groupHeading: (styles) => ({
    ...styles,
    color: 'rgba(0,0,0,0.87)',
    fontSize: '80%',
  }),
};

const DropdownIndicator = () => <ExpandMore />;

export const Select: FC<SelectProps> = ({
  styles = selectStyles,
  optional = false,
  label = '',
  error = '',
  style = {},
  ...rest
}) => {
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
        components={{ DropdownIndicator }}
        {...rest}
      />
      {error && <span className="field-error">{error}</span>}
    </Wrapper>
  );
};
