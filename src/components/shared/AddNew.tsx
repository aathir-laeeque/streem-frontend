import { Add } from '@material-ui/icons';
import React, { SFC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  align-items: center;
  color: #12aab3;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  width: max-content;
  margin-top: 10px;

  .icon {
    color: #12aab3;
    margin-right: 8px;
  }
`;

type AddNewProps = {
  onClick: () => void;
  label?: string;
};

const AddNew: SFC<AddNewProps> = ({ onClick, label = 'Add New' }) => (
  <Wrapper className="add-new-item" onClick={onClick}>
    <Add className="icon" fontSize="small" />
    {label}
  </Wrapper>
);

export default AddNew;
