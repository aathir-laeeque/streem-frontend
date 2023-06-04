import React from 'react';
import { Task } from '#JobComposer/checklist.types';
import { FC } from 'react';
import styled from 'styled-components';
import { getAutomationActionTexts } from '../../utils';
import { useTypedSelector } from '#store';

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
  task: Omit<Task, 'parameters'>;
};

const AutomationInfo: FC<AutomationInfoProps> = ({ task }) => {
  const {
    parameters: { parametersById, parametersMappedToJobById },
  } = useTypedSelector((state) => state.composer);

  if (task.automations?.length) {
    return (
      <Wrapper>
        {task.automations.map((automation) => {
          const objectTypeDisplayName = parametersById[
            automation.actionDetails.referencedParameterId
          ]
            ? parametersById[automation.actionDetails.referencedParameterId]?.data
                ?.objectTypeDisplayName
            : parametersMappedToJobById[automation.actionDetails.referencedParameterId]?.data
                ?.objectTypeDisplayName;
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
