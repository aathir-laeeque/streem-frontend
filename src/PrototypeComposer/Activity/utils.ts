import {
  Activity,
  ActivityType,
  Checklist,
  MandatoryActivity,
  NonMandatoryActivity,
} from '../checklist.types';
import { ActivitiesById, ActivityOrderInTaskInStage } from './reducer.types';
import { v4 as uuidv4 } from 'uuid';

const getActivities = (checklist: Checklist | Partial<Checklist>) => {
  const listById: ActivitiesById = {},
    activityOrderInTaskInStage: ActivityOrderInTaskInStage = {};

  checklist?.stages?.map((stage) => {
    activityOrderInTaskInStage[stage.id] = {};

    stage?.tasks?.map((task) => {
      activityOrderInTaskInStage[stage.id][task.id] = [];

      task?.activities?.map((activity) => {
        activityOrderInTaskInStage[stage.id][task.id].push(activity.id);

        listById[activity.id] = { ...activity, errors: [] };
      });
    });
  });

  return { listById, activityOrderInTaskInStage };
};

const generateNewActivity = ({
  type,
  orderTree,
  mandatory,
  label,
  description,
}: Pick<Activity, 'label' | 'description' | 'mandatory' | 'orderTree'> & {
  type: ActivityType;
}): Partial<Activity> | null => {
  switch (type) {
    case MandatoryActivity.CHECKLIST:
      return {
        orderTree,
        type,
        data: [{ id: uuidv4(), name: '' }],
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryActivity.YES_NO:
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

    case MandatoryActivity.MULTISELECT:
    case MandatoryActivity.SINGLE_SELECT:
      return {
        orderTree,
        type,
        data: [{ id: uuidv4(), name: '' }],
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryActivity.PARAMETER:
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

    case MandatoryActivity.MEDIA:
    case MandatoryActivity.SIGNATURE:
    case MandatoryActivity.TEXTBOX:
      return {
        orderTree,
        type,
        data: {},
        label,
        mandatory,
        description,
        validations: {},
      };

    case MandatoryActivity.CALCULATION:
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

    case MandatoryActivity.RESOURCE:
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

    case MandatoryActivity.DATE:
    case MandatoryActivity.NUMBER:
      return {
        orderTree,
        type,
        data: { text: '' },
        label,
        mandatory,
        description,
        validations: {},
      };

    case NonMandatoryActivity.INSTRUCTION:
      return {
        orderTree,
        type,
        data: { text: '' },
        label,
        mandatory,
        description,
        validations: {},
      };

    case NonMandatoryActivity.MATERIAL:
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

export { getActivities, generateNewActivity };
