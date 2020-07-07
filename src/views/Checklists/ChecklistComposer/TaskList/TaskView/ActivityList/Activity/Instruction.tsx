import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from './actions';
import { ActivityProps, Activity } from './types';
import { useTypedSelector } from '#store';

const Instruction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const update = (data: Activity) => dispatch(updateActivity(data));

  return (
    <div className="instruction-interaction">
      <div className="form-field">
        <textarea
          className="form-field-textarea"
          name="instruction"
          value={activity.data?.text}
          rows={4}
          onChange={(e) =>
            update({ ...activity, data: { text: e.target.value } })
          }
          disabled={isChecklistEditable ? false : true}
        />
      </div>
    </div>
  );
};

export default Instruction;
