import { ArrowRightAlt } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'task-buttons',
})`
  display: flex;
  flex-direction: column;
  padding: 32px;

  button {
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    outline: none;
  }

  .complete-task {
    border: 1px solid #1d84ff;
    border-radius: 4px;
    color: #1d84ff;
    padding: 10px 0;

    > .icon {
      color: #1d84ff;
      margin-left: 12px;
    }
  }

  .skip-task {
    color: #1d84ff;
    margin-top: 24px;
  }
`;

type FooterProps = {
  canSkipTask: boolean;
};

const Footer: FC<FooterProps> = ({ canSkipTask }) => (
  <Wrapper>
    <button className="complete-task">
      Complete Task <ArrowRightAlt className="icon" />
    </button>

    <button className="skip-task">
      {canSkipTask ? 'Skip the task' : 'Force close task'}
    </button>
  </Wrapper>
);

export default Footer;
