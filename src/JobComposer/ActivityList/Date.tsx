import { MandatoryParameter } from '#JobComposer/checklist.types';
import { FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import { InputTypes } from '#utils/globalTypes';
import { LinkOutlined } from '@material-ui/icons';
import moment from 'moment';
import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { executeParameter, fixParameter } from './actions';
import { ParameterProps } from './types';

const DateParameter: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, isCorrectingError }) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [value, setValue] = React.useState(parameter?.response?.value);
  const {
    composer: {
      parameters: { parametersById },
    },
  } = useTypedSelector((state) => state);

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      if (parameter?.response?.value) {
        setValue(parameter?.response?.value);
      }
    }
  }, [parameter?.response?.value]);

  const onBlurHandler = (val: string) => {
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

  const linkedResourceParameter = parametersById?.[parameter?.autoInitialize?.parameterId];

  return (
    <div className="date-parameter">
      <div className="new-form-field">
        <label className="new-form-field-label">Date Parameter</label>
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
                label:
                  parameter.type === MandatoryParameter.DATE ? 'Enter Date' : 'Enter Date Time',
                onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                  const value = moment(e.target.value).unix().toString();
                  onBlurHandler(value);
                },
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
