import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from '../actions';
import { ActivityProps, Activity } from '../types';
import { useTypedSelector } from '#store';
import { ChecklistState } from '#views/Checklists/types';
import { Wrapper } from './styles';

const Instruction: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { state } = useTypedSelector((state) => state.checklist.composer);

  const isChecklistEditable = state === ChecklistState.ADD_EDIT;

  const update = (data: Activity) => dispatch(updateActivity(data));

  return (
    <Wrapper>
      {isChecklistEditable ? (
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
      ) : (
        <div
          className="viewing-state"
          // contentEditable={true}
          // onChange={(e) => console.log('e', e)}
        >
          {activity.data?.text}
        </div>
      )}
    </Wrapper>
  );
};

export default Instruction;
