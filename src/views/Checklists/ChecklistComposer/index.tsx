import { useTypedSelector } from '#store';
import { propsTransformer } from '#utils/propsTransformer';
import { isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../types';
import { fetchChecklist, setChecklistState } from './actions';
import Header from './Header';
import StagesList from './StageList';
import { Wrapper } from './styles';
import TaskList from './TaskList';
import { ComposerProps } from './types';

const Composer: FC<ComposerProps> = ({
  checklistId,
  checklistState = ChecklistState.ADD_EDIT,
}) => {
  const dispatch = useDispatch();

  const { loading, checklist } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  useEffect(() => {
    !!checklistId && dispatch(fetchChecklist(parseInt(checklistId)));

    dispatch(setChecklistState(checklistState));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (!isEmpty(checklist)) {
    return (
      <Wrapper>
        <Header />

        <StagesList />

        <TaskList />
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default propsTransformer(
  (p) => ({
    ...p,
    ...(p?.location?.state?.checklistId && {
      checklistId: p.location.state.checklistId,
    }),
  }),
  Composer,
);
