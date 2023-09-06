import { TextInput } from '#components';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import { jobActions } from '#views/Job/jobStore';
import { LinkOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from './Parameter';

const NumberParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const { parameters } = useTypedSelector((state) => state.job);
  const [value, setValue] = React.useState(parameter?.response?.value);
  const inputRef = useRef(null);
  let linkedResourceParameter;

  useEffect(() => {
    if (parameter.autoInitialized) {
      linkedResourceParameter = parameters.get(parameter!.autoInitialize!.parameterId);
    }
  }, []);

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      if (parameter?.response?.value) {
        setValue(parameter?.response?.value);
      }
    }
  }, [parameter?.response?.value]);

  const onChange = (val: string) => {
    customOnChange(val, (val) => {
      const _parameter = {
        ...parameter,
        data: { ...parameter.data, input: parseFloat(val) },
      };

      if (isCorrectingError) {
        dispatch(
          jobActions.fixParameter({
            parameter: _parameter,
          }),
        );
      } else {
        dispatch(
          jobActions.executeParameter({
            parameter: _parameter,
          }),
        );
      }
    });
    setValue(val);
  };

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
