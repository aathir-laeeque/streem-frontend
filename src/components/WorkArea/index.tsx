import React, { FC } from 'react';

import { ContentArea, Wrapper } from './styles';

const WorkArea: FC = ({ children }) => {
  return (
    <Wrapper>
      <ContentArea>{children}</ContentArea>
    </Wrapper>
  );
};

export default WorkArea;
