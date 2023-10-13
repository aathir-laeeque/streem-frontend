import { MandatoryParameter } from '#JobComposer/checklist.types';
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
