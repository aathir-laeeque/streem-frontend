import React, { FC } from 'react';
import ReactSelect, { Props } from 'react-select';
import styled from 'styled-components';

export const formatOptionLabel: Props<{
  option: string;
  label: string;
  externalId: string;
}>['formatOptionLabel'] = ({ externalId, label }, { context }) =>
  context === 'value' ? (
    label
  ) : (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>{label}</div>
      <div>{externalId}</div>
    </div>
  );

type SelectProps = Props & {
  error?: string;
  label?: string;
  optional?: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'react-custom-select',
})`
  .label {
    align-items: center;
    color: #161616;
    display: flex;
    font-size: 14px;
    justify-content: flex-start;
    letter-spacing: 0.16px;
    line-height: 1.29;
    margin-bottom: 8px;
  }
`;

export type Option = { label: string; value: string | number };

export const selectStyles: Props['styles'] = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? 'transparent' : '#f4f4f4',
    border: 'none',
    borderBottom: isDisabled ? 'none' : '1px solid #bababa',
    borderRadius: 'none',
    boxShadow: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    padding: '1.7px',
    minHeight: 'auto',
  }),

  valueContainer: (styles, { isDisabled }) => ({
    ...styles,
    flexDirection: isDisabled ? 'column' : styles.flexDirection,
    alignItems: isDisabled ? 'flex-start' : styles.alignItems,
  }),

  multiValue: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? 'transparent' : styles.backgroundColor,
  }),

  multiValueLabel: (styles, { isDisabled }) => ({
    ...styles,
    marginTop: isDisabled ? '-7px' : 'unset',
  }),

  multiValueRemove: (styles, { isDisabled }) => ({
    ...styles,
    display: isDisabled ? 'none' : styles.display,
  }),

  indicatorsContainer: (styles, { isDisabled }) => ({
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
    borderRadius: 'none',
  }),

  menuList: (styles) => ({
    ...styles,
    padding: 0,
  }),
};

export const Select: FC<SelectProps> = ({
  styles = selectStyles,
  optional = false,
  label = '',
  error = '',
  ...rest
}) => {
  return (
    <Wrapper>
      {label && <label className="label">{label}</label>}
      <ReactSelect
        classNamePrefix="custom-select"
        menuPlacement="auto"
        styles={styles}
        isClearable={optional}
        captureMenuScroll={true}
        {...rest}
      />
      {error && <span className="field-error">{error}</span>}
    </Wrapper>
  );
};
