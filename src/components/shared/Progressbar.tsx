import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'progress-bar',
})`
  background-color: ${({ bgColor }) => bgColor};
  border-radius: 4px;
  height: ${({ height }) => `${height}px`};
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

const ProgressBar: FC<{
  percentage: number;
  color?: string;
  bgColor?: string;
  height?: number;
}> = ({
  percentage = 0,
  color = '#1d84ff',
  bgColor = '#f4f4f4',
  height = 8,
}) => (
  <Wrapper
    percentage={percentage}
    color={color}
    bgColor={bgColor}
    height={height}
  >
    <div className="filler"></div>
  </Wrapper>
);

export default ProgressBar;
