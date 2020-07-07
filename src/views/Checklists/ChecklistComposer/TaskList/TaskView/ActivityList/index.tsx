import { useTypedSelector } from '#store';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import {
  Checklist,
  Instruction,
  Material,
  ShouldBe,
  Signature,
  Textbox,
  YesNo,
} from './Activity';
import { ActivityType } from './Activity/types';
import { setActiveActivity } from './Activity/actions';
import OptionalSwitch from './OptionalSwitch';
import { Wrapper } from './styles';
import { ActivityListProps } from './types';
import { useDispatch } from 'react-redux';

const ActivityList: FC<ActivityListProps> = ({ activitiesId }) => {
  const {
    activities: { list, activeActivityId },
    isChecklistEditable,
  } = useTypedSelector((state) => state.checklist.composer);

  const dispatch = useDispatch();

  return (
    <Wrapper>
      {activitiesId.map((activityId, index) => (
        <div className="interaction" key={index}>
          <div
            className={`interaction-position-control${
              !isChecklistEditable ? ' hide' : ''
            }`}
          >
            <ArrowUpwardOutlined className="icon arrow-up" />
            <ArrowDownwardOutlined className="icon arrow-down" />
          </div>

          <div
            className={`interaction-content${
              activityId === activeActivityId
                ? ' interaction-content-active'
                : ''
            }`}
            onClick={() => {
              if (activeActivityId !== activityId) {
                dispatch(setActiveActivity(activityId));
              }
            }}
          >
            {(() => {
              const activity = list[activityId];

              if (activity)
                switch (activity.type) {
                  case ActivityType.CHECKLIST:
                    return <Checklist activity={activity} />;

                  case ActivityType.INSTRUCTION:
                    return <Instruction activity={activity} />;

                  case ActivityType.MATERIAL:
                    return <Material activity={activity} />;

                  // case ActivityType.MEDIA:
                  //   break;

                  // case ActivityType.MULTISELECT:
                  //   break;

                  case ActivityType.SHOULDBE:
                    return <ShouldBe activity={activity} />;

                  case ActivityType.SIGNATURE:
                    return <Signature activity={activity} />;

                  case ActivityType.TEXTBOX:
                    return <Textbox activity={activity} />;

                  case ActivityType.YESNO:
                    return <YesNo activity={activity} />;

                  default:
                    return null;
                }
            })()}

            {isChecklistEditable ? (
              <OptionalSwitch activityId={activityId} />
            ) : null}
          </div>

          <MoreVertOutlined
            className={`icon more-options${
              !isChecklistEditable ? ' hide' : ''
            }`}
          />
        </div>
      ))}
    </Wrapper>
  );
};

export default ActivityList;
