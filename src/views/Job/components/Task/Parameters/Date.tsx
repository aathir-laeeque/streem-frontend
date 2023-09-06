import { FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import { InputTypes } from '#utils/globalTypes';
import { jobActions } from '#views/Job/jobStore';
import { LinkOutlined } from '@material-ui/icons';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from './Parameter';

const DateParameter: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [value, setValue] = React.useState(parameter?.response?.value);
  const { parameters } = useTypedSelector((state) => state.job);

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

  const onChangeHandler = (val: string) => {
    customOnChange(val, (val: string) => {
      const _parameter = {
        ...parameter,
        data: { ...parameter.data, input: val },
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
    <div className="date-parameter">
      <div className="new-form-field">
        <FormGroup
          style={{ padding: 0 }}
          inputs={[
            {
              type: parameter.type as unknown as InputTypes,
              props: {
                defaultValue: value,
                ['data-id']: parameter.id,
                ['data-type']: parameter.type,
                ref: inputRef,
                disabled: parameter?.autoInitialized,
                onChange: ({ value }) => onChangeHandler(value),
              },
            },
          ]}
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

export default DateParameter;
