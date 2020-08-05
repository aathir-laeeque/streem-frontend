import { useTypedSelector } from '#store';
import { ChecklistState } from '#views/Checklists/types';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity } from '../actions';
import { Activity, ActivityProps } from '../types';
import { Wrapper } from './styles';

const TextboxInteraction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { state } = useTypedSelector((state) => state.checklist.composer);
  const isChecklistEditable = state === ChecklistState.ADD_EDIT;

  const execute = (data: Activity) => dispatch(executeActivity(data));

  return (
    <Wrapper>
      <div className="form-field">
        <label className="form-field-label">{activity.label}</label>
        <textarea
          className="form-field-textarea"
          rows={4}
          value={activity?.response?.value}
          placeholder="Enter your remarks"
          onChange={(e) =>
            execute({ ...activity, data: { input: e.target.value } })
          }
          disabled={isChecklistEditable}
        />
      </div>
    </Wrapper>
  );
};

export default TextboxInteraction;
