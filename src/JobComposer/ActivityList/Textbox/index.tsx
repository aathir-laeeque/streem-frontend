import { MandatoryParameter } from '#JobComposer/checklist.types';
import { TextInput } from '#components';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import { LinkOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameter, fixParameter } from '../actions';
import { ParameterProps } from '../types';
import { keyBy } from 'lodash';

const TextboxParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const {
    parameters: { parametersById },
    data: { parameterValues: cjfParameters },
  } = useTypedSelector((state) => state.composer);
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

  const linkedResourceParameter = { ...parametersById, ...keyBy(cjfParameters, 'id') }?.[
    parameter?.autoInitialize?.parameterId
  ];

  return (
    <div className="textbox-parameter">
      <div className="new-form-field">
        {parameter.type === MandatoryParameter.MULTI_LINE ? (
          <textarea
            ref={inputRef}
            className="new-form-field-textarea"
            placeholder="Users will write their comments here"
            data-id={parameter.id}
            data-type={parameter.type}
            value={value}
            disabled={parameter?.autoInitialized}
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
            disabled={parameter?.autoInitialized}
            onChange={({ value }) => onChange(value)}
          />
        )}
      </div>
      {parameter?.autoInitialized && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LinkOutlined style={{ marginRight: 8 }} /> Linked to ‘{linkedResourceParameter?.label}’
        </div>
      )}
    </div>
  );
};

export default TextboxParameter;
