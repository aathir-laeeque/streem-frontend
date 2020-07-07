import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityProps, Activity } from './types';
import { updateActivity } from './actions';
import { useTypedSelector } from '#store';

const TextboxInteraction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const update = (data: Activity) => dispatch(updateActivity(data));

  return (
    <div className="textbox-interaction">
      <div className="form-field">
        <label className="form-field-label">{activity.label}</label>
        <textarea
          className="form-field-textarea"
          rows={4}
          value={activity.data.text}
          placeholder="Enter your remarks"
          onChange={(e) =>
            update({ ...activity, data: { text: e.target.value } })
          }
          disabled={isChecklistEditable}
        />
      </div>
    </div>
  );
};

export default TextboxInteraction;
