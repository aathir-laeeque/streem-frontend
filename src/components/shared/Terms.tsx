import React, { FC } from 'react';
import styled from 'styled-components';
import { Link } from '@reach/router';

const Wrapper = styled.span.attrs({})`
  color: #999999;
  font-size: 16px;
  letter-spacing: 0.15px;
  padding: 12px;
  padding-bottom: 0px;
  text-align: center;
`;

export const Terms: FC = () => {
  return (
    <Wrapper>
      Some text which can explain about{' '}
      <Link className="link" to="#">
        terms & conditions
      </Link>
      , if any
    </Wrapper>
  );
};
