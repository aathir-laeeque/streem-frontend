import React, { FC, useState } from 'react';
import Select from 'react-select';

import { ActivityProps } from '../types';
import { Wrapper, customSelectStyles } from './styles';

const RULES = [
  { label: 'Equal To', value: 'EQUAL_TO' },
  { label: 'Less Than', value: 'LESS_THAN' },
  { label: 'Less Than Equal To', value: 'LESS_THAN_EQUAL_TO' },
  { label: 'More Than', value: 'MORE_THAN' },
  { label: 'More Than Equal To', value: 'MORE_THAN_EQUAL_TO' },
  { label: 'Is Between', value: 'IS_BETWEEN' },
];

const ShouldBeActivity: FC<ActivityProps> = ({ activity }) => {
  const [stateActivity, setStateActivity] = useState(activity);

  return (
    <Wrapper>
      <div className="new-form-field">
        <label className="new-form-field-label">Parameter</label>
        <input
          className="new-form-field-input"
          type="text"
          placeholder="Parameter"
          value={stateActivity.data.parameter}
        />
      </div>

      <div className="new-form-field">
        <label className="new-form-field-label">Units of measurement</label>
        <input
          className="new-form-field-input"
          type="text"
          placeholder="Placeholder Text"
          value={stateActivity.data.uom}
        />
      </div>

      <div className="new-form-field">
        <label className="new-form-field-label">Criteria</label>
        {/* <input
          className="new-form-field-input"
          type="text"
          placeholder="Select"
        /> */}
        <Select
          options={RULES}
          value={RULES.filter((el) => el.value === stateActivity.data.operator)}
          onChange={(option) => {
            setStateActivity({
              ...stateActivity,
              data: { ...stateActivity.data, operator: option.value },
            });
          }}
          styles={customSelectStyles}
        />
      </div>

      {stateActivity.data.operator === 'IS_BETWEEN' ? (
        <div className="is-between-values">
          <div className="new-form-field">
            <label className="new-form-field-label">Value</label>
            <input
              className="new-form-field-input"
              type="text"
              placeholder="Quantity"
              value={stateActivity.data.value}
            />
          </div>

          <div>And</div>

          <div className="new-form-field">
            <label className="new-form-field-label">Value</label>
            <input
              className="new-form-field-input"
              type="text"
              placeholder="Quantity"
              value={stateActivity.data.value}
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
            value={stateActivity.data.value}
          />
        </div>
      )}
    </Wrapper>
  );
};

export default ShouldBeActivity;
