import {
  AutomationAction,
  AutomationActionActionTypeVisual,
  AutomationActionTriggerTypeVisual,
  TriggerTypeEnum,
} from '#PrototypeComposer/checklist.types';
import {
  Checklist,
  MandatoryParameter,
  Parameter,
  ParameterVariationType,
  Stage,
  Task,
  TaskExecution,
} from '#types';
import { labelByConstraint } from '#utils';
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
  const parameters = {};
  const variationDetails = {};
  checklist?.stages?.map((stage: any) => {
    stage?.tasks?.map((task: any) => {
      task?.parameters?.map((parameter: any) => {
        if (parameter?.response?.variations?.length) {
          variationDetails[parameter.id] = {
            data: parameter?.response?.variations,
            location: `Task ${stage?.orderTree}.${task?.orderTree}`,
            parameterId: parameter.id,
          };
        }
        parameters[parameter.id] = parameter;
      });
    });
  });

  // Add ParameterValues
  (parameterValues || []).map((parameter) => {
    parameters[parameter.id] = parameter;
  });

  return { parameters, variationDetails };
};

export const getTransformedTasks = (checklist: Checklist) => {
  const transformedTasks = new Map();
  const hiddenIds: Record<string, boolean> = {};

  checklist.stages.forEach((stage: Stage) => {
    let visibleTasksCount = 0;
    stage.tasks.forEach((task: Task) => {
      let visibleTaskExecutionsCount = 0;
      task.parameters.forEach((parameter: Parameter) => {
        parameter.response.forEach((res) => {
          let taskExecution = {
            stageId: stage.id,
            ...task,
            parameters: [
              ...(transformedTasks.get(res.taskExecutionId)?.parameters || []),
              {
                ...parameter,
                response: res,
              },
            ],
            taskExecutions: undefined,
            visibleParametersCount: 0,
          };

          if (res.hidden) {
            hiddenIds[res.id] = true;
          } else {
            taskExecution.visibleParametersCount++;
          }

          transformedTasks.set(res.taskExecutionId, taskExecution);
        });
      });

      task.taskExecutions.forEach((taskExecution: TaskExecution) => {
        let _taskExecution = transformedTasks.get(taskExecution.id) || {
          ...task,
          stageId: stage.id,
          taskExecution,
          taskExecutions: undefined,
        };

        if (_taskExecution.visibleParametersCount === 0) {
          hiddenIds[taskExecution.id] = true;
        } else {
          visibleTaskExecutionsCount++;
        }

        transformedTasks.set(taskExecution.id, {
          ..._taskExecution,
          taskExecution,
          taskExecutions: undefined,
        });
      });

      if (visibleTaskExecutionsCount !== 0) {
        visibleTasksCount++;
      }
    });

    if (visibleTasksCount === 0) {
      hiddenIds[stage.id] = true;
    }
  });

  return { transformedTasks, hiddenIds };
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
          return `Check if entered value ${
            labelByConstraint(parameter.type)[currDetail.constraint]
          } ${currDetail.propertyDisplayName} of selected ${dependentParameter?.label} value`;
        })
        .join(',');

    case MandatoryParameter.RESOURCE:
      return isValidation
        ? details
            ?.map((currDetail: any) => {
              const value = currDetail?.value
                ? currDetail.value
                : currDetail.options.map((currOption) => currOption.displayName).join(',');
              return `Check if ${currDetail.propertyDisplayName} of ${
                parameter.data.objectTypeDisplayName
              } ${labelByConstraint(parameter.type)[currDetail.constraint]} ${value}`;
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
              return `Check if ${parameter.data.objectTypeDisplayName} where ${
                parameterObjectTypeProperty?.displayName
              } ${labelByConstraint(parameter.type)[currDetail.op]} ${value}`;
            })
            .join(',');

    default:
      return '';
  }
};

const generateVariationDetailText = (
  type: string,
  parameterId: string,
  parameters,
  objectTypesList: [],
) => {
  return function (details: any[]) {
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
};

export const generateVariationData = (variationDetails, parameters, objectTypesList) => {
  let updatedData: {}[] = [];

  Object.keys(variationDetails)?.forEach((key) => {
    (variationDetails[key]?.data || [])?.forEach((obj) => {
      const parameterId = variationDetails[key]?.parameterId;
      const location = variationDetails[key]?.location;
      const generateVariationFn = generateVariationDetailText(
        obj.type,
        parameterId,
        parameters,
        objectTypesList,
      );
      const temp = {
        ...obj,
        location: location,
        oldVariationString: obj.oldVariation
          ? generateVariationFn(obj.oldVariation)
          : DEFAULT_VALUE,
        newVariationString: obj.newVariation
          ? generateVariationFn(obj.newVariation)
          : DEFAULT_VALUE,
      };
      updatedData.push(temp);
    });
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
