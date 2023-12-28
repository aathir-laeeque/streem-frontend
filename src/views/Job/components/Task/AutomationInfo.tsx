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
import { navigate } from '@reach/router';

const Wrapper = styled.div.attrs({
  className: 'automation-info',
})`
  display: flex;
  flex-direction: column;
  grid-area: task-automation;
  display: flex;
  gap: 16px;

  .automation {
    .automation-left-container {
      display: grid;
      width: 100%;
      grid-template-columns: auto 1fr auto;
      grid-gap: 8px;

      span {
        word-break: break-word;
      }

      .link-objects {
        .link-object-url {
          color: #1d84ff;
          text-decoration: none;
          cursor: pointer;
        }
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

const RenderAutomationInfo = ({
  automation,
  parameterRefData,
  setIsAutomationPresent,
  parameter,
}) => {
  useEffect(() => {
    setIsAutomationPresent(true);
  }, []);

  return (
    <div className="automation">
      <span className="automation-text">
        {getAutomationActionTexts(automation, null, parameterRefData, false, parameter)}
      </span>
    </div>
  );
};

const RenderExecutedAutomationInfo = ({
  automation,
  parameterRefData,
  setIsAutomationPresent,
  parameter,
  closeOverlay,
}) => {
  const getRedirectedUrl = () => {
    if (automation.actionDetails.objectTypeId) {
      navigate(`/ontology/object-types/${automation?.actionDetails?.objectTypeId}`);
    } else {
      const objectId = parameterRefData?.data?.objectTypeId;
      navigate(`/ontology/object-types/${objectId}`);
    }
    closeOverlay && closeOverlay();
  };

  useEffect(() => {
    setIsAutomationPresent(true);
  }, []);

  return (
    <div className="automation">
      <div className="automation-left-container">
        <img src={TickIcon} className="image-container" />
        <span>{getAutomationActionTexts(automation, null, parameterRefData, true, parameter)}</span>
        <span className="link-objects">
          <span className="link-object-url" onClick={getRedirectedUrl}>
            View Objects
          </span>
        </span>
      </div>
    </div>
  );
};

const AutomationInfo: FC<AutomationInfoProps> = ({ task, executedSection, closeOverlay }) => {
  const { parameters } = useTypedSelector((state) => state.job);
  const [isAutomationPresent, setIsAutomationPresent] = useState(false);
  const { taskExecution } = task;

  if (task.automations?.length) {
    return (
      <Wrapper>
        {task.automations.map((automation) => {
          const parameterRefData = parameters.get(automation.actionDetails.referencedParameterId);
          const parameter = parameters.get(automation?.actionDetails?.parameterId);

          if (executedSection) {
            if (taskExecution?.state === TaskExecutionState.NOT_STARTED) {
              return null;
            } else if (taskExecution?.state === TaskExecutionState.COMPLETED) {
              return (
                <RenderExecutedAutomationInfo
                  parameterRefData={parameterRefData}
                  automation={automation}
                  setIsAutomationPresent={setIsAutomationPresent}
                  parameter={parameter}
                  closeOverlay={closeOverlay}
                />
              );
            } else {
              if (automation.triggerType === AutomationActionTriggerType.TASK_STARTED) {
                return (
                  <RenderExecutedAutomationInfo
                    parameterRefData={parameterRefData}
                    automation={automation}
                    setIsAutomationPresent={setIsAutomationPresent}
                    parameter={parameter}
                    closeOverlay={closeOverlay}
                  />
                );
              } else {
                return null;
              }
            }
          } else {
            return (
              <RenderAutomationInfo
                parameterRefData={parameterRefData}
                automation={automation}
                setIsAutomationPresent={setIsAutomationPresent}
                parameter={parameter}
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
