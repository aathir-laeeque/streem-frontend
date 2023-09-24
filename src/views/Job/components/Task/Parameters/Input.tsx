import { FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import { InputTypes } from '#utils/globalTypes';
import { jobActions } from '#views/Job/jobStore';
import { LinkOutlined } from '@material-ui/icons';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from './Parameter';
import { MandatoryParameter } from '#types';

const InputParameter: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const [linkParamLabel, setLinkParamLabel] = useState<string>('');
  const [value, setValue] = useState(parameter.response.value);
  const { parameters, updating } = useTypedSelector((state) => state.job);

  useEffect(() => {
    if (parameter.autoInitialize) {
      setLinkParamLabel(parameters.get(parameter.autoInitialize.parameterId)?.label || '');
    }
  }, []);

  useEffect(() => {
    if (!updating && parameter.response.value !== value) {
      setValue(parameter.response.value);
    }
  }, [parameter.response.value, updating]);

  const onChange = useCallback(({ value }: { value: string }) => {
    customOnChange(value, (value: string) => {
      const _parameter = {
        ...parameter,
        data: {
          ...parameter.data,
          input: parameter.type === MandatoryParameter.NUMBER ? parseFloat(value) : value,
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
  }, []);

  const propsByType = useMemo(() => {
    switch (parameter.type) {
      case MandatoryParameter.NUMBER:
        return { placeholder: 'Ex. 2' };
      case MandatoryParameter.SINGLE_LINE:
        return { placeholder: 'Write here' };
      case MandatoryParameter.MULTI_LINE:
        return { placeholder: 'Users will write their comments here', rows: 4 };
      default:
        return undefined;
    }
  }, [parameter.type]);

  return (
    <div className="input-parameter">
      <div className="new-form-field">
        <FormGroup
          style={{ padding: 0 }}
          inputs={[
            {
              type: parameter.type as unknown as InputTypes,
              props: {
                id: parameter.id,
                value: value,
                ['data-id']: parameter.id,
                ['data-type']: parameter.type,
                disabled: parameter?.autoInitialized,
                onChange,
                ...propsByType,
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

export default InputParameter;
