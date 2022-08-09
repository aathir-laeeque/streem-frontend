import { TextInput } from '#components';
import { customOnChange } from '#utils/formEvents';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeActivity, fixActivity } from './actions';
import { ActivityProps } from './types';

const NumberActivity: FC<ActivityProps> = ({ activity, isCorrectingError }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [value, setValue] = React.useState(activity?.response?.value);

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      if (activity?.response?.value) {
        setValue(activity?.response?.value);
      }
    }
  }, [activity?.response?.value]);

  const onChange = (val: string) => {
    customOnChange(val, (val) => {
      const newData = {
        ...activity,
        data: { ...activity.data, input: parseFloat(val) },
      };

      if (isCorrectingError) {
        dispatch(fixActivity(newData));
      } else {
        dispatch(executeActivity(newData));
      }
    });
    setValue(val);
  };

  return (
    <div className="number-activity">
      <div className="new-form-field">
        <label className="new-form-field-label">Number Activity</label>
        <TextInput
          placeholder="Ex. 2"
          type="number"
          className="number-activity-input"
          defaultValue={value}
          label="Enter Number"
          onChange={({ value }) => onChange(value)}
        />
      </div>
    </div>
  );
};

export default NumberActivity;
