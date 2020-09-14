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

      <TaskList />
    </ComposerWrapper>
  );
};

export default Composer;
