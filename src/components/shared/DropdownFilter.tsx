import React, { FC } from 'react';
import styled from 'styled-components';

import Select from './Select';

const Wrapper = styled.div`
  margin-left: 16px;
  min-width: 200px;
  display: none;

  @media (min-width: 1366px) {
    display: block;
  }

  .button {
    padding: 7px 16px;
  }
`;

type DropdownFilterOption = {
  label: string;
  value: string;
};

type DropdownFilterProps = {
  options: DropdownFilterOption[];
  updateFilter: (option) => void;
  label?: string;
};

const DropdownFilter: FC<DropdownFilterProps> = ({
  options,
  updateFilter,
  label,
}) => (
  <Wrapper>
    <Select
      label={label}
      persistValue
      options={options}
      onChange={(option) => updateFilter(option)}
      placeholder="State"
      selectedValue={
        options.filter((el) => el.value === 'all' || el.value === 'any')[0]
      }
    />
  </Wrapper>
);

export default DropdownFilter;
