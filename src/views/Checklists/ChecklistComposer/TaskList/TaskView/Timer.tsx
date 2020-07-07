import React, { FC } from 'react';
import styled from 'styled-components';
import { TARGET_RULES } from './ActivityList/Activity/constants';

interface TimerProps {
  period: number;
}

const Wrapper = styled.div.attrs({
  className: 'timer-card',
})`
  display: flex;
  flex: 1;
  margin: 24px 50px 0 40px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 24px 16px;

  .inner-container {
    border: 1px dashed #bababa;
    border-radius: 4px;
    padding: 24px 16px;

    .timer-rule {
      display: flex;

      > .form-field {
        :last-child {
          margin-left: 15px;
        }
      }
    }
  }
`;

const Timer: FC<TimerProps> = ({ period = 0 }) => {
  return (
    <Wrapper>
      <div className="inner-container">
        <div className="timer-rule">
          <div className="form-field">
            <label className="form-field-label">Time Rule</label>
            <select className="form-field-select">
              {TARGET_RULES.map((rule, index) => (
                <option key={index} value={rule.value}>
                  {rule.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-field-label"></label>
            <input
              type="number"
              className="form-field-input"
              value={period / 60000}
              onChange={(e) => console.log('value :: ', e.target.value)}
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Timer;
