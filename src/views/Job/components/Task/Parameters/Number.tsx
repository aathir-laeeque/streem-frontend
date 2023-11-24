import { FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { InputTypes } from '#utils/globalTypes';
import { jobActions } from '#views/Job/jobStore';
import { LinkOutlined } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from './Parameter';

const NumberParameter: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const [linkParamLabel, setLinkParamLabel] = useState<string>('');
  const [value, setValue] = useState(
    parameter.response.value ? parameter.response.value : undefined,
  );
  const { parameters, updating } = useTypedSelector((state) => state.job);
  const debounceInputRef = useRef(debounce((event, functor) => functor(event), 2000));

  useEffect(() => {
    if (parameter.autoInitialize) {
      setLinkParamLabel(parameters.get(parameter.autoInitialize.parameterId)?.label || '');
    }
  }, []);

  useEffect(() => {
    if (!updating && parameter.response.value !== value) {
      setValue(parameter.response.value ? parameter.response.value : undefined);
    }
  }, [parameter.response.value, updating]);

  const onChange = useCallback(
    ({ value }: { value: string }) => {
      debounceInputRef.current(value, (value: string) => {
        const _parameter = {
          ...parameter,
          data: {
            ...parameter.data,
            input: parseFloat(value),
          },
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
      setValue(value);
    },
    [isCorrectingError],
  );

  return (
    <div className="input-parameter">
      <div className="new-form-field">
        <FormGroup
          style={{ padding: 0 }}
          inputs={[
            {
              type: InputTypes.NUMBER,
              props: {
                id: parameter.id,
                value: value,
                ['data-id']: parameter.id,
                ['data-type']: parameter.type,
                disabled: parameter?.autoInitialized,
                onChange,
                placeholder: 'Ex. 2',
              },
            },
          ]}
        />
      </div>
      {linkParamLabel && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LinkOutlined style={{ marginRight: 8 }} /> Linked to ‘{linkParamLabel}’
        </div>
      )}
    </div>
  );
};

export default NumberParameter;
