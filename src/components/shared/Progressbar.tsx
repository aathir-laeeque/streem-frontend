import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'progress-bar',
})`
  background-color: #f4f4f4;
  border-radius: 4px;
  height: 8px;
  position: relative;
  width: 100%;

  .filler {
    background-color: ${({ color }) => color};
    border-radius: inherit;
    height: 100%;
    transition: width 0.2s ease-in;
    width: ${({ percentage }) => `${percentage}%`};
  }
`;

const ProgressBar: FC<{ percentage: number; color?: string }> = ({
  percentage = 0,
  color = '#1d84ff',
}) => (
  <Wrapper percentage={percentage} color={color}>
    <div className="filler"></div>
  </Wrapper>
);

export default ProgressBar;
