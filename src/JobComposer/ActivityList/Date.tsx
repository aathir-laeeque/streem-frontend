import { FormGroup } from '#components';
import { customOnChange } from '#utils/formEvents';
import { InputTypes } from '#utils/globalTypes';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameter, fixParameter } from './actions';
import { ParameterProps } from './types';

const DateParameter: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [value, setValue] = React.useState(parameter?.response?.value);

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      if (parameter?.response?.value) {
        setValue(parameter?.response?.value);
      }
    }
  }, [parameter?.response?.value]);

  const onChange = (val: string) => {
    customOnChange(val, (val: string) => {
      const newData = {
        ...parameter,
        data: { ...parameter.data, input: val },
      };

      if (isCorrectingError) {
        dispatch(fixParameter(newData));
      } else {
        dispatch(executeParameter(newData));
      }
    });
    setValue(val);
  };

  return (
    <div className="date-parameter">
      <div className="new-form-field">
        <label className="new-form-field-label">Date Parameter</label>
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

export default DateParameter;
