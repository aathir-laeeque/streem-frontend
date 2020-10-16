import { useTypedSelector } from '#store';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchComposerData, resetComposer } from './actions';
import Header from './Header';
import { fetchAssignedReviewersForChecklist } from './reviewer.actions';
import Stages from './Stages';
import { ComposerWrapper, LoaderWrapper } from './styles';
import Tasks from './Tasks';
import { ComposerProps } from './types';

const Composer: FC<ComposerProps> = ({ id, entity }) => {
  const dispatch = useDispatch();

  const { loading } = useTypedSelector((state) => state.prototypeComposer);

  useEffect(() => {
    if (id) {
      dispatch(fetchComposerData({ entity, id: parseInt(id) }));
      dispatch(fetchAssignedReviewersForChecklist(parseInt(id)));
    }

    return () => {
      dispatch(resetComposer());
    };
  }, []);

  if (loading) {
    return <LoaderWrapper>Loading...</LoaderWrapper>;
  }

  return (
    <ComposerWrapper>
      <Header />

      <Stages />

      <Tasks />
    </ComposerWrapper>
  );
};

export default Composer;
