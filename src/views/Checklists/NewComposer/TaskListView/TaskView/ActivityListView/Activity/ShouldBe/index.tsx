import React, { FC, useState } from 'react';
import Select from 'react-select';

import { customSelectStyles } from '../commonStyles';
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

const ShouldBeActivity: FC<ActivityProps> = ({ activity }) => {
  return (
    <Wrapper>
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
          onChange={(option) => {}}
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
    </Wrapper>
  );
};

export default ShouldBeActivity;
