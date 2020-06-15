import React, { FC } from 'react';

import { InteractionViewProps } from './types';
import { TARGET_RULES } from './constants';

const ShouldBeInteraction: FC<InteractionViewProps> = ({ interaction }) => (
  <div className="step-interaction-container">
    <div className="shouldbe-interaction">
      <div className="form-field">
        <label className="form-input-label">Parameter</label>
        <input
          className="form-input form-input-value"
          name="parameter"
          type="text"
          value=""
          placeholder="Pressure"
          onChange={undefined}
        />
      </div>
      <div className="form-field">
        <label className="form-input-label">Type</label>
        <input
          className="form-input form-input-value"
          name="type"
          type="text"
          value={interaction.data[0].type}
          placeholder="Type"
          onChange={undefined}
        />
      </div>
      <div className="form-field">
        <label className="form-input-label">UOM</label>
        <input
          className="form-input form-input-value"
          name="uom"
          type="text"
          value={interaction.data[0].uom}
          placeholder="UOM"
          onChange={undefined}
        />
      </div>
      <div id="target-rules">
        <div className="form-field">
          <label className="form-input-label">Target</label>
          <select id="target-rule-select" className="form-input">
            <option value="" selected disabled hidden>
              Choose here
            </option>
            {TARGET_RULES.map((rule, index) => (
              <option key={index} value={rule.value}>
                {rule.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label className="form-input-label">Value</label>
          <input
            className="form-input form-input-value"
            name="target-value"
            type="text"
            value={interaction.data[0].value}
            placeholder="Value"
            onChange={undefined}
          />
        </div>
      </div>
      <div className="form-field">
        <label className="form-input-label">Observed</label>
        <input
          className="form-input form-input-value"
          name="observed-value"
          type="text"
          placeholder="To be entered at execution"
          onChange={undefined}
        />
      </div>
    </div>
  </div>
);

export default ShouldBeInteraction;
