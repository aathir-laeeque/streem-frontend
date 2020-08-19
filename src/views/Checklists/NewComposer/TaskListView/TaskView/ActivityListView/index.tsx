import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';

import { ActivityType } from '../../../checklist.types';
import MaterialActivity from './Activity/Material';
import YesNoActivity from './Activity/YesNo';
import TextboxActivity from './Activity/Textbox';
import { Wrapper } from './styles';
import { ActivityListViewProps } from './types';

const ActivityListView: FC<ActivityListViewProps> = ({ activities }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      {activities.map((activity, index) => (
        <div className="activity" key={index}>
          <div
            className={`activity-position-control${!isEditing ? ' hide' : ''}`}
          >
            <ArrowUpwardOutlined className="icon arrow-up" />
            <ArrowDownwardOutlined className="icon arrow-down" />
          </div>

          <div className={`activity-content`}>
            <div
              className={`optional${activity.mandatory ? ' hide' : ''}${
                isEditing ? ' hide' : ''
              }`}
            >
              Optional Activity
            </div>
            {(() => {
              switch (activity.type) {
                // Ashish will make the changes for this when free, Snehal will migrate it here
                case ActivityType.SIGNATURE:
                  return `signature ${activity.id}`;

                // Snehal
                // PRIORITY
                case ActivityType.INSTRUCTION:
                  return `instruction ${activity.id}`;

                case ActivityType.MULTISELECT: // single select activity to be added from BE, support that as well in the component
                  return `MultiSelect ${activity.id}`;

                case ActivityType.MEDIA:
                  return `Media ${activity.id}`;

                case ActivityType.SHOULDBE: // will be renamed to parameter activity later
                  return `shouldBe ${activity.id}`;

                case ActivityType.CHECKLIST:
                  return `checklist ${activity.id}`;

                // DONE ACTIVITIES
                case ActivityType.MATERIAL:
                  return <MaterialActivity activity={activity} />;

                case ActivityType.TEXTBOX: // named as comment activity in zeplin
                  return <TextboxActivity activity={activity} />;

                case ActivityType.YESNO:
                  return <YesNoActivity activity={activity} />;

                default:
                  return null;
              }
            })()}
          </div>

          <div className={`activity-icons${!isEditing ? ' hide' : ''}`}>
            <MoreVertOutlined className="icon" />
          </div>
        </div>
      ))}
    </Wrapper>
  );
};

export default ActivityListView;
