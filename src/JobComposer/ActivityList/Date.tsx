import { FormGroup, TextInput } from '#components';
import { customOnChange } from '#utils/formEvents';
import { InputTypes } from '#utils/globalTypes';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeActivity, fixActivity } from './actions';
import { ActivityProps } from './types';

const DateActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity, isCorrectingError }) => {
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
    customOnChange(val, (val: string) => {
      const newData = {
        ...activity,
        data: { ...activity.data, input: val },
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
    <div className="date-activity">
      <div className="new-form-field">
        <label className="new-form-field-label">Date Activity</label>
        <FormGroup
          style={{ padding: 0 }}
          inputs={[
            {
              type: InputTypes.DATE,
              props: {
                defaultValue: value,
                label: 'Enter Date',
                onChange: ({ value }: { name: string; value: string }) => {
                  onChange(value);
                },
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default DateActivity;
