import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import Select from 'react-select';

import { customSelectStyles } from '../MultiSelect/commonStyles';
import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const RULES = [
  { label: 'Equal To', value: 'EQUAL_TO' },
  { label: 'Less Than', value: 'LESS_THAN' },
  { label: 'Less Than Equal To', value: 'LESS_THAN_EQUAL_TO' },
  { label: 'More Than', value: 'MORE_THAN' },
  { label: 'More Than Equal To', value: 'MORE_THAN_EQUAL_TO' },
  { label: 'Is Between', value: 'IS_BETWEEN' },
];

const generateText = (data) => {
  let operator: string;

  switch (data.operator) {
    case 'EQUAL_TO':
      operator = '(=) equal to';
      break;
    case 'LESS_THAN':
      operator = '(<) less than';
      break;
    case 'LESS_THAN_EQUAL_TO':
      operator = '(≤) less than equal to';
      break;
    case 'MORE_THAN':
      operator = '(>) more than';
      break;
    case 'LESS_THAN':
      operator = '(≥) more than equal to';
      break;
    case 'IS_BETWEEN':
      return `${data.parameter} should be between ${data.lowerValue} ${data.uom} and ${data.upperValue} ${data.uom}`;
  }

  return `${data.parameter} should be ${operator} ${data?.value ?? 50} ${
    data.uom
  }`;
};

const ShouldBeActivity: FC<ActivityProps> = ({ activity }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  const isJobsView = entity === Entity.JOB;

  return (
    <Wrapper>
      {!isJobsView ? (
        <>
          <div className="new-form-field">
            <label className="new-form-field-label">Parameter</label>
            <input
              className="new-form-field-input"
              type="text"
              placeholder="Parameter"
              value={activity.data.parameter}
            />
          </div>

          <div className="new-form-field">
            <label className="new-form-field-label">Units of measurement</label>
            <input
              className="new-form-field-input"
              type="text"
              placeholder="Placeholder Text"
              value={activity.data.uom}
            />
          </div>

          <div className="new-form-field">
            <label className="new-form-field-label">Criteria</label>
            <Select
              options={RULES}
              value={RULES.filter((el) => el.value === activity.data.operator)}
              onChange={(option) => console.log('selectd option :: ', option)}
              styles={customSelectStyles}
            />
          </div>

          {activity.data.operator === 'IS_BETWEEN' ? (
            <div className="is-between-values">
              <div className="new-form-field">
                <label className="new-form-field-label">Value</label>
                <input
                  className="new-form-field-input"
                  type="text"
                  placeholder="Quantity"
                  value={activity.data.value}
                />
              </div>

              <div>And</div>

              <div className="new-form-field">
                <label className="new-form-field-label">Value</label>
                <input
                  className="new-form-field-input"
                  type="text"
                  placeholder="Quantity"
                  value={activity.data.value}
                />
              </div>
            </div>
          ) : (
            <div className="new-form-field">
              <label className="new-form-field-label">Value</label>
              <input
                className="new-form-field-input"
                type="text"
                placeholder="Quantity"
                value={activity.data.value}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <span className="parameter-text">{generateText(activity.data)}</span>
          <div className="new-form-field">
            <label className="new-form-field-label">Observed Value</label>
            <input
              className="new-form-field-input"
              type="number"
              name="observed-value"
              placeholder="Enter Observed Value"
              value={activity?.response?.value}
              onChange={(e) => {
                console.log('e.target.value :: ', e.target.value);
              }}
            />
          </div>
        </>
      )}
    </Wrapper>
  );
};

export default ShouldBeActivity;
