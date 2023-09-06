import { MandatoryParameter } from '#JobComposer/checklist.types';
import { TextInput } from '#components';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import { jobActions } from '#views/Job/jobStore';
import { LinkOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from '../Parameter';

const TextboxParameter: FC<ParameterProps> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const { parameters } = useTypedSelector((state) => state.job);
  const [value, setValue] = React.useState('');
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

  const onChange = (v: string) => {
    customOnChange(v, (value: string) => {
      const _parameter = {
        ...parameter,
        data: { ...parameter.data, input: value },
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
    setValue(v);
  };

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
