import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityProps, updateDataParams } from './types';
import { updateActivityData } from './actions';

const TextboxInteraction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  // TODO: look into type of data in interaction
  const updateData = (data: updateDataParams) =>
    dispatch(updateActivityData(data));

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
            updateData({ data: { text: e.target.value }, id: activity.id })
          }
        />
      </div>
    </div>
  );
};

export default TextboxInteraction;
