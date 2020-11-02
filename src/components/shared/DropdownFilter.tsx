import React, { FC } from 'react';
import styled from 'styled-components';

import Select from './Select';

const Wrapper = styled.div`
  margin-left: 16px;
  min-width: 200px;
`;

type DropdownFilterOption = {
  label: string;
  value: string;
};

type DropdownFilterProps = {
  options: DropdownFilterOption[];
  updateFilter: (option) => void;
};

const DropdownFilter: FC<DropdownFilterProps> = ({ options, updateFilter }) => {
  return (
    <Wrapper>
      <Select
        persistValue
        options={options}
        onChange={(option) => updateFilter(option)}
        placeholder="State"
      />
    </Wrapper>
  );
};

export default DropdownFilter;
