import { NonMandatoryActivity } from '../../Composer/checklist.types';
import {
  Activity,
  ActivityType,
  Checklist,
  MandatoryActivity,
} from '../checklist.types';
import { ActivitiesById, ActivityOrderInTaskInStage } from './reducer.types';

const getActivities = (checklist: Checklist | Partial<Checklist>) => {
  const listById: ActivitiesById = {},
    activityOrderInTaskInStage: ActivityOrderInTaskInStage = {};

  checklist?.stages?.map((stage) => {
    activityOrderInTaskInStage[stage.id] = {};

    stage?.tasks?.map((task) => {
      activityOrderInTaskInStage[stage.id][task.id] = [];

      task?.activities?.map((activity) => {
        activityOrderInTaskInStage[stage.id][task.id].push(activity.id);

        listById[activity.id] = { ...activity };
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
    case MandatoryActivity.YES_NO:
    case MandatoryActivity.MULTISELECT:
      return {
        orderTree,
        type,
        data: [],
        label: '',
        mandatory: true,
      };

    case MandatoryActivity.MEDIA:
    case MandatoryActivity.SHOULD_BE:
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
        data: {},
        label: '',
        mandatory: false,
      };

    case NonMandatoryActivity.MATERIAL:
      return {
        orderTree,
        type,
        data: [],
        label: '',
        mandatory: false,
      };

    default:
      return null;
  }
};

export { getActivities, generateNewActivity };
