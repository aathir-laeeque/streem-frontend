import { useTypedSelector } from '#store';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchData, resetComposer } from './actions';
import { ComposerProps } from './composer.types';
import Header from './Header';
import StageList from './StageList';
import ComposerWrapper from './styles';
import TaskList from './TaskList';

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();
  const { isIdle } = useTypedSelector((state) => state.auth);
  const { activeStageId } = useTypedSelector((state) => state.composer.stages);

  useEffect(() => {
    if (!isIdle) {
      if (id) {
        dispatch(fetchData({ id, entity }));
      } else {
        console.log('no id got to fetch data');
      }

      return () => {
        dispatch(resetComposer());
      };
    }
  }, [isIdle]);

  return (
    <ComposerWrapper>
      <Header />

      <StageList />

      {activeStageId ? <TaskList /> : null}
    </ComposerWrapper>
  );
};

export default Composer;
