import React from 'react';
import { Task } from '#JobComposer/checklist.types';
import { FC } from 'react';
import styled from 'styled-components';
import { getAutomationActionTexts } from '../../utils';

const Wrapper = styled.div.attrs({
  className: 'automation-info',
})`
  display: flex;
  flex-direction: column;
  background-color: #f7f9fa;
  margin-bottom: 24px;

  .automation {
    padding: 8px 24px;

    :first-child {
      padding-top: 16px;
    }

    :last-child {
      padding-bottom: 16px;
    }

    .heading {
      font-weight: bold;
      margin-right: 8px;
    }
  }
`;

type AutomationInfoProps = {
  task: Omit<Task, 'parameters'>;
};

const AutomationInfo: FC<AutomationInfoProps> = ({ task }) => {
  if (task.automations?.length) {
    return (
      <Wrapper>
        {task.automations.map((automation) => (
          <div className="automation">
            <span className="heading">Automation:</span>
            <span>{getAutomationActionTexts(automation)}</span>
          </div>
        ))}
      </Wrapper>
    );
  }

  return null;
};

export default AutomationInfo;
