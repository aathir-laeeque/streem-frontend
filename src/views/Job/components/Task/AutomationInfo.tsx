import {
  AutomationActionTriggerType,
  TaskExecutionState,
} from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { StoreTask } from '#types';
import { getAutomationActionTexts } from '#utils/parameterUtils';
import React, { FC, useEffect, useState } from 'react';
import TickIcon from '../../../../assets/svg/green-tick-icon.svg';
import styled from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'automation-info',
})`
  display: flex;
  flex-direction: column;
  grid-area: task-automation;

  .automation {
    padding: 4px 0px;
    display: flex;

    .automation-text {
      padding: 4px 0px;
    }

    .automation-left-container {
      display: flex;
      width: calc(100% - 105px);

      .image-container {
        margin: 0px 4px;
      }

      :first-child {
        padding-top: 10px;
      }

      :last-child {
        padding-bottom: 10px;
      }
    }

    :first-child {
      padding-top: 16px;
    }

    :last-child {
      padding-bottom: 16px;
    }

    .link-objects {
      width: 105px;
      padding-top: 10px;

      .link-object-url {
        color: #1d84ff;
        text-decoration: none;
      }
    }
  }

  .automation-executed-disclaimer {
    color: #ccc;
    text-align: center;
  }
`;

type AutomationInfoProps = {
  task: StoreTask;
  executedSection: boolean = false;
};

const RenderAutomationInfo = ({ automation, objectTypeDisplayName, setIsAutomationPresent }) => {
  useEffect(() => {
    setIsAutomationPresent(true);
  }, []);

  return (
    <div className="automation">
      <span className="automation-text">
        {getAutomationActionTexts(automation, null, objectTypeDisplayName)}
      </span>
    </div>
  );
};

const RenderExecutedAutomationInfo = ({
  automation,
  objectTypeDisplayName,
  setIsAutomationPresent,
}) => {
  useEffect(() => {
    setIsAutomationPresent(true);
  }, []);

  return (
    <div className="automation">
      <div className="automation-left-container">
        <img src={TickIcon} className="image-container" />
        <span>{getAutomationActionTexts(automation, null, objectTypeDisplayName)}</span>
      </div>
      <span className="link-objects">
        <a
          className="link-object-url"
          href={`/ontology/object-types/${automation.actionDetails.objectTypeId}`}
        >
          View Objects
        </a>
      </span>
    </div>
  );
};

const AutomationInfo: FC<AutomationInfoProps> = ({ task, executedSection }) => {
  const { parameters } = useTypedSelector((state) => state.job);
  const [isAutomationPresent, setIsAutomationPresent] = useState(false);
  const { taskExecution } = task;

  if (task.automations?.length) {
    return (
      <Wrapper>
        {task.automations.map((automation) => {
          const parameterData = parameters.get(automation.actionDetails.referencedParameterId);
          const objectTypeDisplayName = parameterData?.data?.objectTypeDisplayName;
          if (executedSection) {
            if (taskExecution?.state === TaskExecutionState.NOT_STARTED) {
              return null;
            } else if (taskExecution?.state === TaskExecutionState.COMPLETED) {
              return (
                <RenderExecutedAutomationInfo
                  objectTypeDisplayName={objectTypeDisplayName}
                  automation={automation}
                  setIsAutomationPresent={setIsAutomationPresent}
                />
              );
            } else {
              if (automation.triggerType === AutomationActionTriggerType.TASK_STARTED) {
                return (
                  <RenderExecutedAutomationInfo
                    objectTypeDisplayName={objectTypeDisplayName}
                    automation={automation}
                    setIsAutomationPresent={setIsAutomationPresent}
                  />
                );
              } else {
                return null;
              }
            }
          } else {
            return (
              <RenderAutomationInfo
                objectTypeDisplayName={objectTypeDisplayName}
                automation={automation}
                setIsAutomationPresent={setIsAutomationPresent}
              />
            );
          }
        })}
        {!isAutomationPresent && (
          <div className="automation-executed-disclaimer">No automations executed yet</div>
        )}
      </Wrapper>
    );
  }

  return null;
};

export default AutomationInfo;
