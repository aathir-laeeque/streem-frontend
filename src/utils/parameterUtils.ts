import {
  AutomationAction,
  AutomationActionActionTypeVisual,
  AutomationActionTriggerTypeVisual,
  TriggerTypeEnum,
} from '#PrototypeComposer/checklist.types';
import { MandatoryParameter, Parameter, ParameterVariationType } from '#types';
import { DEFAULT_VALUE } from '#views/Jobs/PrintJob/constant';
import { InputTypes } from './globalTypes';
import { generateShouldBeCriteria } from './stringUtils';
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

export const getParameters = ({
  checklist,
  parameterValues,
}: {
  checklist: any;
  parameterValues: any;
}) => {
  const hiddenIds: Record<string, boolean> = {};
  const parameters = {};
  const variationDetails = {};
  checklist?.stages?.map((stage: any) => {
    let hiddenTasksLength = 0;
    stage?.tasks?.map((task: any) => {
      let hiddenParametersLength = 0;
      task?.parameters?.map((parameter: any) => {
        if (parameter.response?.hidden) {
          hiddenParametersLength++;
          hiddenIds[parameter.id] = true;
        }
        if (parameter?.response?.variations?.length) {
          variationDetails[parameter.id] = {
            data: parameter?.response?.variations,
            location: `Task ${stage?.orderTree}.${task?.orderTree}`,
            parameterId: parameter.id,
          };
        }
        parameters[parameter.id] = parameter;
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

  // Add ParameterValues
  (parameterValues || []).map((parameter) => {
    parameters[parameter.id] = parameter;
  });

  return { hiddenIds, parameters, variationDetails };
};

const getContentString = (
  details: any[],
  parameter: Parameter,
  isValidation: boolean = false,
  parameters: Parameter[],
  objectTypesList: [],
) => {
  switch (parameter.type) {
    case MandatoryParameter.NUMBER:
      return details
        ?.map((currDetail: any) => {
          const dependentParameter = parameters[currDetail.parameterId];
          return `Check if entered value ${parameter.type[currDetail.constraint]} ${
            currDetail.propertyDisplayName
          } of selected ${dependentParameter?.label} value`;
        })
        .join(',');

    case MandatoryParameter.RESOURCE:
      return isValidation
        ? details
            ?.map((currDetail: any) => {
              const value = currDetail?.value
                ? currDetail.value
                : currDetail.options.map((currOption) => currOption.displayName).join(',');
              return `Check if ${currDetail.propertyDisplayName} of ${parameter.data.objectTypeDisplayName} ${value}`;
            })
            .join(',')
        : details
            ?.map((currDetail: any) => {
              const dependentParameter = parameters[currDetail.referencedParameterId];
              const parameterObjectType = objectTypesList?.find(
                (currObjectType) => currObjectType.id === parameter?.data.objectTypeId,
              );
              const parameterObjectTypeProperty = [
                ...(parameterObjectType?.properties || []),
                ...(parameterObjectType?.relations || []),
              ].find((currProperty) => currProperty.id === currDetail?.field?.split('.')[1]);
              const value = dependentParameter
                ? `the selected ${dependentParameter.label} value`
                : currDetail?.hasOwnProperty('displayName')
                ? `${currDetail.displayName} ${currDetail?.externalId ? currDetail.externalId : ''}`
                : ` ${currDetail.values[0]}`;
              return `Check if ${parameter.data.objectTypeDisplayName} where ${parameterObjectTypeProperty?.displayName} ${value}`;
            })
            .join(',');

    default:
      return '';
  }
};

const generateVariationDetailText = (
  details: any[],
  type: string,
  parameterId: string,
  parameters,
  objectTypesList: [],
) => {
  const parameterData = parameters[parameterId];
  switch (type) {
    case ParameterVariationType.FILTER:
      return getContentString(details, parameterData, false, parameters, objectTypesList);
    case ParameterVariationType.VALIDATION:
      return getContentString(details, parameterData, true, parameters, objectTypesList);
    case ParameterVariationType.SHOULD_BE:
      const detail = Array.isArray(details) ? details[0] : details;
      const uom = detail?.uom || '';
      const value =
        detail.operator === 'BETWEEN'
          ? `${detail.lowerValue} ${uom} and ${detail.upperValue} ${uom}`
          : `${detail.value} ${uom}`;
      return `Check if entered value is ${generateShouldBeCriteria(detail)} ${value}`;
  }
};

export const generateVariationData = (variationDetails, parameters, objectTypesList) => {
  const updatedData = Object.keys(variationDetails)?.map((key) => {
    const obj = variationDetails[key]?.data[0];
    const parameterId = variationDetails[key]?.parameterId;
    const location = variationDetails[key]?.location;

    return {
      ...obj,
      location: location,
      oldVariationString: obj.oldVariation
        ? generateVariationDetailText(
            obj.oldVariation,
            obj.type,
            parameterId,
            parameters,
            objectTypesList,
          )
        : DEFAULT_VALUE,
      newVariationString: obj.newVariation
        ? generateVariationDetailText(
            obj.newVariation,
            obj.type,
            parameterId,
            parameters,
            objectTypesList,
          )
        : DEFAULT_VALUE,
    };
  });
  return updatedData;
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
