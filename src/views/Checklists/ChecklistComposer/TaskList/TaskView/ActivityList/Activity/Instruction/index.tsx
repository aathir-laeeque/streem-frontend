import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from '../actions';
import { Activity, ActivityProps } from '../types';
import { Wrapper } from './styles';

const Instruction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { isChecklistEditable } = useTypedSelector(
    (state) => state.checklist.composer,
  );

  const update = (data: Activity) => dispatch(updateActivity(data));

  return (
    <Wrapper>
      <div className="form-field">
        <label
          className={`form-field-label ${isChecklistEditable ? '' : 'hide'}`}
        >
          Comments
        </label>
        <textarea
          className="form-field-textarea"
          name="instruction"
          value={activity.data?.text}
          rows={4}
          onChange={(e) =>
            update({ ...activity, data: { text: e.target.value } })
          }
          disabled={isChecklistEditable ? false : true}
          placeholder="Type here..."
        />
      </div>
    </Wrapper>
  );
};

export default Instruction;
