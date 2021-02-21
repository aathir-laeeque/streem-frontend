import React, { ComponentPropsWithRef, FC, forwardRef } from 'react';
import styled from 'styled-components';

type OptionType = { label: string; value: string | number | readonly string[] };

type Props = {
  label?: string;
  options: OptionType[];
} & ComponentPropsWithRef<'select'>;

const Select = styled.select<Omit<Props, 'options'>>`
  background-color: #f4f4f4;
  border: none;
  border-bottom: 1px solid #999999;
  color: #000000;
  outline: none;
  padding: 12px 16px;
  width: inherit;
`;

const Option = styled.option`
  padding: 12px 16px;
`;

export const Dropdown = forwardRef<HTMLSelectElement, Props>(
  ({ options, onChange, name, label }, ref) => (
    <div className="new-form-field">
      {label ? <label className="new-form-field-label">{label}</label> : null}

      <Select onChange={onChange} ref={ref} name={name}>
        {options?.map((option, index) => (
          <Option key={index} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  ),
);

Dropdown.displayName = 'Dropdown';
