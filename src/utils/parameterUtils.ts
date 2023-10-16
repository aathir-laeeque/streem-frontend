import { ParametersById } from '#PrototypeComposer/Activity/reducer.types';
import {
  AutomationAction,
  AutomationActionActionTypeVisual,
  AutomationActionTriggerTypeVisual,
  Checklist,
} from '#PrototypeComposer/checklist.types';
import {
  MandatoryParameter,
  ParameterVerificationStatus,
  ParameterVerificationTypeEnum,
} from '#types';
import { Verification } from '#views/Jobs/ListView/types';
import { formatDateTime } from './timeUtils';

const responseDetailsForChoiceBasedParameters = ({ data, response }: any) => {
  let detailList: any[] = [];
  data.forEach((currData: any) => {
    if (response?.choices?.[currData.id] === 'SELECTED') {
      return detailList.push(`${currData.name}${response.reason ? ` :${response.reason}` : ''}`);
    }
  });
  return detailList.join(', ');
};

export const getParameterContent = (parameter: any) => {
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
      parameterContent = parameter.response?.value ? formatDateTime(parameter.response.value) : '-';
      break;
    case MandatoryParameter.YES_NO:
      parameterContent = responseDetailsForChoiceBasedParameters(parameter);
      break;
    case MandatoryParameter.SINGLE_SELECT:
      parameterContent = responseDetailsForChoiceBasedParameters(parameter);
      break;
    case MandatoryParameter.RESOURCE:
      parameterContent = parameter.response?.choices?.reduce(
        (acc: any, currChoice: any) =>
          (acc = `${currChoice.objectDisplayName} (ID: ${currChoice.objectExternalId})`),
        '',
      );
      break;
    case MandatoryParameter.MULTI_RESOURCE:
      parameterContent = parameter?.response?.choices
        ?.reduce(
          (acc: string, currChoice: any) =>
            acc + `${currChoice.objectDisplayName} (ID: ${currChoice.objectExternalId}) \n`,
          '',
        )
        ?.split('\n')
        ?.map((str: string) => str);
      break;
    case MandatoryParameter.MULTISELECT:
      parameterContent = responseDetailsForChoiceBasedParameters(parameter);
      break;
    default:
      return;
  }

  return parameterContent ? parameterContent : '-';
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

export const getParameters = ({ checklist, userId }: { checklist: any; userId: string }) => {
  const parametersById: ParametersById = {},
    parametersOrderInTaskInStage: any = {};
  const hiddenIds: Record<string, boolean> = {};
  let showVerificationBanner = false;
  checklist?.stages?.map((stage) => {
    let hiddenTasksLength = 0;
    parametersOrderInTaskInStage[stage.id] = {};

    stage?.tasks?.map((task) => {
      let hiddenParametersLength = 0;
      parametersOrderInTaskInStage[stage.id][task.id] = [];

      task?.parameters?.map((parameter) => {
        parametersOrderInTaskInStage[stage.id][task.id].push(parameter.id);
        parametersById[parameter.id] = { ...parameter, hasError: false };
        if (parameter.response?.hidden || task.hidden) {
          hiddenParametersLength++;
          hiddenIds[parameter.id] = true;
        } else if (
          !showVerificationBanner &&
          parameter.verificationType !== ParameterVerificationTypeEnum.NONE
        ) {
          const dependantVerification = (parameter.response?.parameterVerifications || []).find(
            (verification: Verification) =>
              verification?.requestedTo?.id === userId &&
              verification?.verificationStatus === ParameterVerificationStatus.PENDING,
          );
          if (dependantVerification) {
            showVerificationBanner = true;
          }
        }
      });
      if (task.hidden || task?.parameters?.length === hiddenParametersLength) {
        hiddenTasksLength++;
        hiddenIds[task.id] = true;
      }
    });
    if (stage?.tasks?.length === hiddenTasksLength) {
      hiddenIds[stage.id] = true;
    }
  });

  return { parametersById, parametersOrderInTaskInStage, hiddenIds, showVerificationBanner };
};

export const fileTypeCheck = (collectionOfTypes: string[] = [], type: string) => {
  return collectionOfTypes.includes(type);
};
