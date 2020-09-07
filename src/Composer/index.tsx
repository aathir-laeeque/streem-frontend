import { useTypedSelector } from '#store';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchData, resetComposer } from './actions';
import Header from './Header';
import StageList from './StageList';
import ComposerWrapper from './styles';
import TaskList from './TaskList';
import { ComposerProps } from './types';

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();

  const { activeStageId } = useTypedSelector((state) => state.composer);

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
    <ComposerWrapper>
      <Header />

      <StageList />

      {activeStageId ? <TaskList /> : null}
    </ComposerWrapper>
  );
};

export default Composer;
