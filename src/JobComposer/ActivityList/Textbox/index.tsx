import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeActivity, fixActivity } from '../actions';
import { ActivityProps } from '../types';

const TextboxActivity: FC<ActivityProps> = ({
  activity,
  isCorrectingError,
}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { entity } = useTypedSelector((state) => state.composer);
  const [value, setValue] = React.useState('');

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      if (activity?.response?.value) {
        setValue(activity?.response?.value);
      }
    }
  }, [activity?.response?.value]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.persist();
    customOnChange(e, (event) => {
      const newData = {
        ...activity,
        data: { ...activity.data, input: event.target.value },
      };

      if (isCorrectingError) {
        dispatch(fixActivity(newData));
      } else {
        dispatch(executeActivity(newData));
      }
    });
    setValue(e.currentTarget.value);
  };

  if (entity === Entity.JOB) {
    return (
      <div className="textbox-activity">
        <div className="new-form-field">
          <label className="new-form-field-label">User Comments Box</label>
          <textarea
            ref={inputRef}
            className="new-form-field-textarea"
            placeholder="Users will write their comments here"
            value={value}
            rows={4}
            onChange={(e) => onChange(e)}
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default TextboxActivity;
