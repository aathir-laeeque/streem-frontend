import {
  AutomationAction,
  AutomationActionActionTypeVisual,
  AutomationActionTriggerTypeVisual,
  TriggerTypeEnum,
} from '#PrototypeComposer/checklist.types';
import { MandatoryParameter } from '#types';
import { DEFAULT_VALUE } from '#views/Jobs/PrintJob/constant';
import { InputTypes } from './globalTypes';
import { formatDateTime } from './timeUtils';

export const responseDetailsForChoiceBasedParameters = ({ data, response }: any) => {
  let detailList: any[] = [];
  data?.forEach((currData: any) => {
    if (response?.choices?.[currData.id] === 'SELECTED') {
      return detailList.push(
        `${currData.name}${response.reason ? ` : Remarks - ${response.reason}` : ''}`,
      );
    }
  });
  return detailList.join(', ');
};

export const getParameterContent = (parameter: any, format?: string) => {
  let parameterContent;

  switch (parameter.type) {
    case MandatoryParameter.SHOULD_BE:
    case MandatoryParameter.MULTI_LINE:
    case MandatoryParameter.SINGLE_LINE:
    case MandatoryParameter.NUMBER:
      parameterContent = parameter.response.value;
      break;
    case MandatoryParameter.DATE:
    case MandatoryParameter.DATE_TIME:
      parameterContent = parameter.response?.value
        ? formatDateTime({
            value: parameter.response.value,
            type:
              parameter.type === MandatoryParameter.DATE ? InputTypes.DATE : InputTypes.DATE_TIME,
            format,
          })
        : DEFAULT_VALUE;
      break;
    case MandatoryParameter.YES_NO:
      parameterContent = responseDetailsForChoiceBasedParameters(parameter);
      break;
    case MandatoryParameter.SINGLE_SELECT:
      parameterContent = responseDetailsForChoiceBasedParameters(parameter);
      break;
    case MandatoryParameter.RESOURCE:
    case MandatoryParameter.MULTI_RESOURCE:
      parameterContent = (parameter.response.choices || [])
        .map((c: any) => `${c.objectDisplayName} (ID: ${c.objectExternalId})`)
        .join(', ');
      break;
    case MandatoryParameter.MULTISELECT:
      parameterContent = responseDetailsForChoiceBasedParameters(parameter);
      break;
    default:
      return;
  }

  return parameterContent ? parameterContent : DEFAULT_VALUE;
};

export const ObjectIdsDataFromChoices = (choices: any) => {
  let data: string[] = [];
  if (choices?.length > 0) {
    choices?.forEach((choice: any) => {
      data.push(choice.objectId);
    });
    return data;
  } else {
    return null;
  }
};

export const getAutomationActionTexts = (
  automation: AutomationAction,
  forNotify?: 'success' | 'error' | null,
  objectTypeDisplayName?: string,
) => {
  if (forNotify === 'success') {
    return `Triggered "${AutomationActionActionTypeVisual[automation.actionType]} ${
      automation.actionDetails.propertyDisplayName || ''
    } of the selected ${automation.actionDetails.objectTypeDisplayName || objectTypeDisplayName}"`;
  } else if (forNotify === 'error') {
    return `Not able to trigger "${AutomationActionActionTypeVisual[automation.actionType]} ${
      automation.actionDetails.propertyDisplayName || ''
    } of the selected ${automation.actionDetails.objectTypeDisplayName || objectTypeDisplayName}"`;
  }

  return `${AutomationActionActionTypeVisual[automation.actionType]} ${
    automation.actionDetails.propertyDisplayName || ''
  } of the selected ${
    automation.actionDetails.objectTypeDisplayName || objectTypeDisplayName
  } when the ${AutomationActionTriggerTypeVisual[automation.triggerType]}.`;
};

export const getParameters = ({ checklist }: { checklist: any }) => {
  const hiddenIds: Record<string, boolean> = {};
  checklist?.stages?.map((stage: any) => {
    let hiddenTasksLength = 0;
    stage?.tasks?.map((task: any) => {
      let hiddenParametersLength = 0;
      task?.parameters?.map((parameter: any) => {
        if (parameter.response?.hidden) {
          hiddenParametersLength++;
          hiddenIds[parameter.id] = true;
        }
      });
      if (task?.parameters?.length === hiddenParametersLength) {
        hiddenTasksLength++;
        hiddenIds[task.id] = true;
      }
    });
    if (stage?.tasks?.length === hiddenTasksLength) {
      hiddenIds[stage.id] = true;
    }
  });

  return { hiddenIds };
};

export const fileTypeCheck = (collectionOfTypes: string[] = [], type: string) => {
  return collectionOfTypes.includes(type);
};

export const logsResourceChoicesMapper = (list: any[]) => {
  return list.reduce((result, jobLog) => {
    const jobId = jobLog.id;
    result[jobId] = {};

    jobLog.logs.forEach((log: any) => {
      if (log.triggerType === TriggerTypeEnum.RESOURCE && log.resourceParameters) {
        for (const key in log.resourceParameters) {
          if (log.resourceParameters.hasOwnProperty(key)) {
            result[jobId][key] = { ...log.resourceParameters[key] };
          }
        }
      }
    });

    return result;
  }, {});
};

export const logsParser = (log: any, jobId: string, resourceParameterChoicesMap: any) => {
  switch (log.triggerType) {
    case TriggerTypeEnum.RESOURCE_PARAMETER:
      const selectedChoices = (
        resourceParameterChoicesMap?.[jobId]?.[log.entityId]?.choices || []
      ).reduce((acc: any[], c: any) => {
        acc.push(`${c?.objectDisplayName} (ID: ${c?.objectExternalId})`);
        return acc;
      }, []);

      return {
        ...log,
        value: selectedChoices?.join(', '),
      };
    default:
      return log;
  }
};
