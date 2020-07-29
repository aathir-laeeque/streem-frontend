import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity } from './actions';
import { Activity, ActivityProps } from './types';

const TextboxInteraction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const execute = (data: Activity) => dispatch(executeActivity(data));

  return (
    <div className="textbox-interaction">
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
    </div>
  );
};

export default TextboxInteraction;
