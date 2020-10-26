import React, { FC } from 'react';
import styled, { css } from 'styled-components';

type Props = {
  height?: number;
  percentage: number;
};

const Wrapper = styled.div.attrs({
  className: 'progress-bar',
})<Props>`
  background-color: #f4f4f4;
  border-radius: 4px;
  height: ${({ height }) => `${height}px`};
  position: relative;
  width: 100%;

  .filler {
    border-radius: inherit;
    height: 100%;
    transition: width 0.2s ease-in;
    width: ${({ percentage }) => `${percentage}%`};

    ${({ percentage }) => {
      if (percentage === 100) {
        return css`
          background-color: #5aa700;
        `;
      } else {
        return css`
          background-color: #1d84ff;
        `;
      }
    }}
  }
`;

const ProgressBar: FC<Props> = ({ percentage = 0, height = 8 }) => (
  <Wrapper percentage={percentage} height={height}>
    <div className="filler"></div>
  </Wrapper>
);

export default ProgressBar;
