import { useTypedSelector } from '#store';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { fetchData, resetComposer } from './actions';
import Header from './Header';
import StageList from './StageList';
import TaskList from './TaskList';
import { ComposerProps } from './types';

const Wrapper = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-row-gap: 16px;
  grid-template-areas: 'header header' 'stages tasks';
  grid-template-columns: 300px 1fr;
  grid-template-rows: auto 1fr;
  height: inherit;
`;

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();

  const { activeStageId } = useTypedSelector((state) => state.composer.stages);

  useEffect(() => {
    if (id) {
      dispatch(fetchData({ id, entity }));
    } else {
      console.log('no id got to fetch data');
    }

    return () => {
      dispatch(resetComposer());
    };
  }, []);

  return (
    <Wrapper>
      <Header />

      <StageList />

      {activeStageId ? <TaskList /> : null}
    </Wrapper>
  );
};

export default Composer;
