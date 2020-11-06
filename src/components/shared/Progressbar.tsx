import React, { FC } from 'react';
import styled, { css } from 'styled-components';

type Props = {
  height?: number;
  percentage: number;
  whiteBackground?: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'progress-bar',
})<Props>`
  border-radius: 4px;
  position: relative;
  width: 100%;

  background-color: ${({ whiteBackground }) =>
    whiteBackground ? '#ffffff' : '#f4f4f4'};
  height: ${({ height }) => `${height}px`};

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
      } else if (percentage === 0) {
        return css`
          background-color: #666666;
          width: 3.25%;
        `;
      } else {
        return css`
          background-color: #1d84ff;
        `;
      }
    }}
  }
`;

const ProgressBar: FC<Props> = ({
  percentage = 0,
  height = 8,
  whiteBackground = false,
}) => (
  <Wrapper
    percentage={percentage}
    height={height}
    whiteBackground={whiteBackground}
  >
    <div className="filler"></div>
  </Wrapper>
);

export default ProgressBar;
