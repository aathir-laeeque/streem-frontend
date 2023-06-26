import { TextInput } from '#components';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import { LinkOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameter, fixParameter } from './actions';
import { ParameterProps } from './types';
import { keyBy } from 'lodash';

const NumberParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const {
    composer: {
      parameters: { parametersById },
      data: { parameterValues: cjfParameters },
    },
  } = useTypedSelector((state) => state);
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

  const linkedResourceParameter = { ...parametersById, ...keyBy(cjfParameters, 'id') }?.[
    parameter?.autoInitialize?.parameterId
  ];

  return (
    <div className="number-parameter">
      <div className="new-form-field">
        <TextInput
          placeholder="Ex. 2"
          type="number"
          className="number-parameter-input"
          data-id={parameter.id}
          data-type={parameter.type}
          ref={inputRef}
          disabled={parameter?.autoInitialized}
          value={value}
          label="Enter Number"
          onChange={({ value }) => onChange(value)}
        />
      </div>
      {parameter?.autoInitialized && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LinkOutlined style={{ marginRight: 8 }} /> Linked to ‘{linkedResourceParameter?.label}’
        </div>
      )}
    </div>
  );
};

export default NumberParameter;
