// import { Entity } from '#Composer/composer.types';
// import { useTypedSelector } from '#store';
import { customOnChange } from '#utils/formEvents';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { executeActivity, fixActivity } from '../actions';
import { ActivityProps } from '../types';
import { Wrapper } from './styles';

// import Select from 'react-select';

// import { customSelectStyles } from '../MultiSelect/commonStyles';
// const RULES = [
//   { label: 'Equal To', value: 'EQUAL_TO' },
//   { label: 'Less Than', value: 'LESS_THAN' },
//   { label: 'Less Than Equal To', value: 'LESS_THAN_EQUAL_TO' },
//   { label: 'More Than', value: 'MORE_THAN' },
//   { label: 'More Than Equal To', value: 'MORE_THAN_EQUAL_TO' },
//   { label: 'Is Between', value: 'IS_BETWEEN' },
// ];

const generateText = (data) => {
  if (data.operator === 'IS_BETWEEN') {
    return `${data.parameter} should be between ${data.lowerValue} ${data.uom} and ${data.upperValue} ${data.uom}`;
  } else {
    let operatorString: string;

    switch (data.operator) {
      case 'EQUAL_TO':
        operatorString = '(=) equal to';
        break;
      case 'LESS_THAN':
        operatorString = '(<) less than';
        break;
      case 'LESS_THAN_EQUAL_TO':
        operatorString = '(≤) less than equal to';
        break;
      case 'MORE_THAN':
        operatorString = '(>) more than';
        break;
      case 'MORE_THAN_EQUAL_TO':
        operatorString = '(≥) more than equal to';
        break;
      default:
        return;
    }

    return `${data.parameter} should be ${operatorString} ${
      data?.value ?? 50
    } ${data.uom}`;
  }
};

const ShouldBeActivity: FC<ActivityProps> = ({
  activity,
  isCorrectingError,
}) => {
  // const { entity } = useTypedSelector((state) => state.composer);

  // const isJobsView = entity === Entity.JOB;
  const [value, setValue] = React.useState(activity?.response?.value || '');
  const dispatch = useDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    customOnChange(e, (event) => {
      console.log('e.target.value :: ', event.target.value);

      const newData = {
        ...activity,
        data: { ...activity.data, input: e.target.value },
      };

      if (isCorrectingError) {
        dispatch(fixActivity(newData));
      } else {
        dispatch(executeActivity(newData));
      }
    });
    setValue(e.currentTarget.value);
  };

  return (
    <Wrapper>
      <span className="parameter-text">{generateText(activity.data)}</span>
      <div className="new-form-field">
        <label className="new-form-field-label">Observed Value</label>
        <input
          className="new-form-field-input"
          type="number"
          name="observed-value"
          placeholder="Enter Observed Value"
          value={value}
          onChange={(e) => onChange(e)}
        />
      </div>
    </Wrapper>
  );
};

export default ShouldBeActivity;
