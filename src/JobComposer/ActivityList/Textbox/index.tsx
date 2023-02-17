import { TextInput } from '#components';
import { MandatoryParameter } from '#JobComposer/checklist.types';
import { Entity } from '#JobComposer/composer.types';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameter, fixParameter } from '../actions';
import { ParameterProps } from '../types';

const TextboxParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { entity } = useTypedSelector((state) => state.composer);
  const [value, setValue] = React.useState('');

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      if (parameter?.response?.value) {
        setValue(parameter?.response?.value);
      }
    }
  }, [parameter?.response?.value]);

  const onChange = (v: string) => {
    customOnChange(v, (value: string) => {
      const newData = {
        ...parameter,
        data: { ...parameter.data, input: value },
      };

      if (isCorrectingError) {
        dispatch(fixParameter(newData));
      } else {
        dispatch(executeParameter(newData));
      }
    });
    setValue(v);
  };

  if (entity === Entity.JOB) {
    return (
      <div className="textbox-parameter">
        <div className="new-form-field">
          <label className="new-form-field-label">
            {parameter.type === MandatoryParameter.MULTI_LINE
              ? 'Multi Line Input'
              : 'Single Line Input'}
          </label>
          {parameter.type === MandatoryParameter.MULTI_LINE ? (
            <textarea
              ref={inputRef}
              className="new-form-field-textarea"
              placeholder="Users will write their comments here"
              data-id={parameter.id}
              data-type={parameter.type}
              value={value}
              rows={4}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : (
            <TextInput
              ref={inputRef}
              placeholder="Write here"
              data-id={parameter.id}
              data-type={parameter.type}
              value={value}
              onChange={({ value }) => onChange(value)}
            />
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default TextboxParameter;
