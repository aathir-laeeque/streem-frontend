import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'stage-list-view',
})`
  background-color: #fff;
  box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12), 1px 0 1px 0 rgba(0, 0, 0, 0.14);
  grid-area: stagelist;
  overflow: hidden;
  position: relative;
`;

const StageList: FC = () => {
  return <Wrapper>This is the stageList</Wrapper>;
};

export default StageList;
