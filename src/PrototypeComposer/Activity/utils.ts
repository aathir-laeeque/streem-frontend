import {
  Parameter,
  ParameterType,
  Checklist,
  MandatoryParameter,
  NonMandatoryParameter,
} from '../checklist.types';
import { ParametersById, ParameterOrderInTaskInStage } from './reducer.types';
import { v4 as uuidv4 } from 'uuid';

const getParameters = (checklist: Checklist | Partial<Checklist>) => {
  const listById: ParametersById = {},
    parameterOrderInTaskInStage: ParameterOrderInTaskInStage = {};

  checklist?.stages?.map((stage) => {
    parameterOrderInTaskInStage[stage.id] = {};

    stage?.tasks?.map((task) => {
      parameterOrderInTaskInStage[stage.id][task.id] = [];

      task?.parameters?.map((parameter) => {
        parameterOrderInTaskInStage[stage.id][task.id].push(parameter.id);

        listById[parameter.id] = { ...parameter, errors: [] };
      });
    });
  });

  return { listById, parameterOrderInTaskInStage };
};

const generateNewParameter = ({
  type,
  orderTree,
  mandatory,
  label,
  description,
}: Pick<Parameter, 'label' | 'description' | 'mandatory' | 'orderTree'> & {
  type: ParameterType;
}): Partial<Parameter> | null => {
  switch (type) {
    case MandatoryParameter.CHECKLIST:
      return {
        orderTree,
        type,
        data: [{ id: uuidv4(), name: '' }],
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryParameter.YES_NO:
      return {
        orderTree,
        type,
        data: [
          { id: uuidv4(), name: '', type: 'yes' },
          { id: uuidv4(), name: '', type: 'no' },
        ],
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryParameter.MULTISELECT:
    case MandatoryParameter.SINGLE_SELECT:
      return {
        orderTree,
        type,
        data: [{ id: uuidv4(), name: '' }],
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryParameter.SHOULD_BE:
      return {
        orderTree,
        type,
        data: {
          uom: '',
          type: '',
          value: '',
          operator: '',
          parameter: '',
        },
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryParameter.MEDIA:
    case MandatoryParameter.SIGNATURE:
    case MandatoryParameter.MULTI_LINE:
    case MandatoryParameter.SINGLE_LINE:
      return {
        orderTree,
        type,
        data: {},
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryParameter.CALCULATION:
      return {
        orderTree,
        type,
        data: {
          expression: '',
          uom: '',
          variables: {},
        },
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryParameter.RESOURCE:
      return {
        orderTree,
        type,
        data: {
          variables: {},
          urlPath: '',
          collection: '',
          objectTypeExternalId: '',
          objectTypeDisplayName: '',
          objectTypeId: '',
          propertyValidations: [],
        },
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryParameter.DATE:
    case MandatoryParameter.DATE_TIME:
    case MandatoryParameter.NUMBER:
      return {
        orderTree,
        type,
        data: { text: '' },
        label,
        mandatory,
        description,
        validations: {},
      };

    case NonMandatoryParameter.INSTRUCTION:
      return {
        orderTree,
        type,
        data: { text: '' },
        label,
        mandatory,
        description,
        validations: {},
      };

    case NonMandatoryParameter.MATERIAL:
      return {
        orderTree,
        type,
        data: [
          {
            link: '',
            name: '',
            type: 'image',
            fileName: '',
            quantity: 0,
            id: uuidv4(),
            mediaId: '',
          },
        ],
        label,
        mandatory,
        description,
        validations: {},
      };

    default:
      return null;
  }
};

export { getParameters, generateNewParameter };
