import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity } from '../actions';
import { ActivityProps } from '../types';

const TextboxActivity: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { entity } = useTypedSelector((state) => state.composer);

  if (entity === Entity.JOB) {
    return (
      <div>
        <div className="new-form-field">
          <label className="new-form-field-label">User Comments Box</label>
          <textarea
            className="new-form-field-textarea"
            placeholder="User will write comments here"
            value={activity?.response?.value}
            rows={4}
            onChange={(e) => {
              e.persist();

              customOnChange(e, (event) => {
                dispatch(
                  executeActivity({
                    ...activity,
                    data: { input: event.target.value },
                  }),
                );
              });
            }}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default TextboxActivity;
