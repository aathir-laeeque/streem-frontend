import React, { ChangeEvent, FC } from 'react';
import styled from 'styled-components';

import Select, { Option } from './Select';

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

type DropdownFilterProps = {
  options: Option[];
  updateFilter: (option: Option) => void;
  label?: string;
};

const DropdownFilter: FC<DropdownFilterProps> = ({ options, updateFilter, label }) => (
  <Wrapper>
    <Select
      label={label}
      persistValue
      options={options}
      onChange={
        ((option: Option) => updateFilter(option)) as ((option: Option) => void) &
          ((event: ChangeEvent<HTMLSelectElement>) => void)
      }
      placeholder="State"
      selectedValue={options.filter((el) => el.value === 'all' || el.value === 'any')[0]}
    />
  </Wrapper>
);

export default DropdownFilter;
