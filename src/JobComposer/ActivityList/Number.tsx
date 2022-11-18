import { TextInput } from '#components';
import { customOnChange } from '#utils/formEvents';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameter, fixParameter } from './actions';
import { ParameterProps } from './types';

const NumberParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
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
    customOnChange(val, (val) => {
      const newData = {
        ...parameter,
        data: { ...parameter.data, input: parseFloat(val) },
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
    <div className="number-parameter">
      <div className="new-form-field">
        <label className="new-form-field-label">Number Parameter</label>
        <TextInput
          placeholder="Ex. 2"
          type="number"
          className="number-parameter-input"
          defaultValue={value}
          label="Enter Number"
          onChange={({ value }) => onChange(value)}
        />
      </div>
    </div>
  );
};

export default NumberParameter;
