import {
  Activity,
  ActivityType,
  Checklist,
  MandatoryActivity,
  NonMandatoryActivity,
} from '../checklist.types';
import { PARAMETER_OPERATORS } from '../constants';
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

type Params = {
  type: ActivityType;
  orderTree: Activity['orderTree'];
};

const generateNewActivity = ({
  type,
  orderTree,
}: Params): Partial<Activity> | null => {
  switch (type) {
    case MandatoryActivity.CHECKLIST:
      return {
        orderTree,
        type,
        data: [{ id: uuidv4(), name: '' }],
        label: '',
        mandatory: true,
      };

    case MandatoryActivity.YES_NO:
      return {
        orderTree,
        type,
        data: [
          { id: uuidv4(), name: '', type: 'yes' },
          { id: uuidv4(), name: '', type: 'no' },
        ],
        label: '',
        mandatory: true,
      };

    case MandatoryActivity.MULTISELECT:
    case MandatoryActivity.SINGLE_SELECT:
      return {
        orderTree,
        type,
        data: [{ id: uuidv4(), name: '' }],
        label: '',
        mandatory: true,
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
        label: '',
        mandatory: true,
      };

    case MandatoryActivity.MEDIA:
    case MandatoryActivity.SIGNATURE:
    case MandatoryActivity.TEXTBOX:
      return {
        orderTree,
        type,
        data: {},
        label: '',
        mandatory: true,
      };

    case NonMandatoryActivity.INSTRUCTION:
      return {
        orderTree,
        type,
        data: { text: '' },
        label: '',
        mandatory: false,
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
          },
        ],
        label: '',
        mandatory: false,
      };

    default:
      return null;
  }
};

export { getActivities, generateNewActivity };
