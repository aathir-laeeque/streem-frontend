import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  grid-area: workarea;

  > div {
    height: 100%;
  }

  background-color: #ecedf1;
  border-top-left-radius: 20px;
  border-top: 1.5px solid rgb(184, 184, 184);
  height: inherit;
  padding: 10px 8px 0 12px;
`;

const ContentArea = styled.div`
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
  height: inherit;
`;

const WorkAreaLayout: FC = ({ children }) => {
  return (
    <Wrapper>
      <ContentArea>{children}</ContentArea>
    </Wrapper>
  );
};

export default WorkAreaLayout;
