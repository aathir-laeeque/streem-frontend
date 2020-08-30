import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { MediaCardProps } from '../types';

const Wrapper = styled.div.attrs({
  className: 'task-media-card',
})`
  grid-area: task-media-card;

  ${({ isTaskActive }) =>
    !isTaskActive
      ? css`
          visibility: hidden;
        `
      : null}
`;

const MediaCard: FC<MediaCardProps> = ({ medias, isTaskActive }) => {
  return (
    <Wrapper isTaskActive={isTaskActive}>
      This is the task Task Media card
    </Wrapper>
  );
};

export default MediaCard;
