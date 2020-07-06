import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import { Wrapper } from './styles';
import { ActivityListProps } from './types';
import { ActivityType } from './Activity/types';
import { useTypedSelector } from '#store';
import {
  Checklist,
  Instruction,
  Material,
  ShouldBe,
  Signature,
  Textbox,
  YesNo,
} from './Activity';

const ActivityList: FC<ActivityListProps> = ({ activitiesId }) => {
  const { list } = useTypedSelector(
    (state) => state.checklist.composer.activities,
  ); // TODO remove this filter when MEDIA and MULTISELECT interactions are complete

  return (
    <Wrapper>
      {activitiesId.map((activityId, index) => (
        <div className="interaction" key={index}>
          <div className="interaction-position-control">
            <ArrowUpwardOutlined className="icon arrow-up" />
            <ArrowDownwardOutlined className="icon arrow-down" />
          </div>

          <div className="interaction-content">
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
          </div>

          <MoreVertOutlined className={`icon more-options`} />
        </div>
      ))}
    </Wrapper>
  );
};

export default ActivityList;
