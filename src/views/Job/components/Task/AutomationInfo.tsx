import { getAutomationActionTexts } from '#JobComposer/TaskList/utils';
import { useTypedSelector } from '#store';
import { StoreTask } from '#types';
import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'automation-info',
})`
  display: flex;
  flex-direction: column;
  background-color: #f7f9fa;
  grid-area: task-automation;

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
  task: StoreTask;
};

const AutomationInfo: FC<AutomationInfoProps> = ({ task }) => {
  const { parameters } = useTypedSelector((state) => state.job);

  if (task.automations?.length) {
    return (
      <Wrapper>
        {task.automations.map((automation) => {
          const parameterData = parameters.get(automation.actionDetails.referencedParameterId);
          const objectTypeDisplayName = parameterData?.data?.objectTypeDisplayName;
          return (
            <div className="automation">
              <span className="heading">Automation:</span>
              <span>{getAutomationActionTexts(automation, null, objectTypeDisplayName)}</span>
            </div>
          );
        })}
      </Wrapper>
    );
  }

  return null;
};

export default AutomationInfo;
