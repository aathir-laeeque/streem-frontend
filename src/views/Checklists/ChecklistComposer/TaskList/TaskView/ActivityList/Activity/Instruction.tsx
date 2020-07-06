import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivityData } from './actions';
import { ActivityProps, updateDataParams } from './types';

const InstructionInteraction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const updateData = (data: updateDataParams) =>
    dispatch(updateActivityData(data));

  return (
    <div className="instruction-interaction">
      <div className="form-field">
        <textarea
          className="form-field-textarea"
          name="instruction"
          value={activity.data?.text}
          rows={4}
          onChange={(e) =>
            updateData({ data: { text: e.target.value }, id: activity.id })
          }
        />
      </div>
    </div>
  );
};

export default InstructionInteraction;
