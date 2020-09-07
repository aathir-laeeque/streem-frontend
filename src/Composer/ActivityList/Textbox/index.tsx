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
  const [value, setValue] = React.useState(activity?.response?.value || 0);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.persist();
    customOnChange(e, (event) => {
      console.log('e.target.value :: ', event.target.value);
      dispatch(
        executeActivity({
          ...activity,
          data: { ...activity.data, input: e.target.value },
        }),
      );
    });
    setValue(e.currentTarget.value);
  };

  if (entity === Entity.JOB) {
    return (
      <div>
        <div className="new-form-field">
          <label className="new-form-field-label">User Comments Box</label>
          <textarea
            className="new-form-field-textarea"
            placeholder="User will write comments here"
            value={value}
            rows={4}
            onChange={(e) => {
              onChange(e);
            }}
            // onChange={(e) => {
            //   e.persist();

            //   customOnChange(e, (event) => {
            //     dispatch(
            //       executeActivity({
            //         ...activity,
            //         data: { input: event.target.value },
            //       }),
            //     );
            //   });
            // }}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default TextboxActivity;
