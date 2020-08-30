import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ActivityListProps } from './types';
import { ActivityType } from '../checklist.types';
import YesNoActivity from './YesNo';

const Wrapper = styled.div.attrs({
  className: 'activity-list',
})`
  display: flex;
  flex-direction: column;

  .activity {
    border-bottom: 1px dashed #dadada;
    padding: 32px;

    :last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .optional-badge {
      font-size: 14px;
      line-height: 1.43;
      letter-spacing: 0.16px;
      margin-bottom: 16px;
      color: #999999;
    }
  }
`;

const ActivityList: FC<ActivityListProps> = ({ activities }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  return (
    <Wrapper>
      {activities.map((activity) => (
        <div key={activity.id} className="activity">
          {entity === Entity.JOB ? (
            activity.type !== ActivityType.INSTRUCTION &&
            activity.type !== ActivityType.MATERIAL ? (
              <div className="optional-badge">Optional</div>
            ) : null
          ) : null}

          {(() => {
            switch (activity.type) {
              case ActivityType.CHECKLIST:
              case ActivityType.INSTRUCTION:
              case ActivityType.MATERIAL:
              case ActivityType.MEDIA:
              case ActivityType.MULTISELECT:
              case ActivityType.SHOULD_BE:
              case ActivityType.SIGNATURE:
              case ActivityType.TEXTBOX:
                return activity.type;

              case ActivityType.YES_NO:
                return <YesNoActivity activity={activity} />;

              default:
                return null;
            }
          })()}
        </div>
      ))}
    </Wrapper>
  );
};

export default ActivityList;
