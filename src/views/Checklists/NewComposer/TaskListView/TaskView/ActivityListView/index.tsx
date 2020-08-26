import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import React, { FC } from 'react';

import { ActivityType } from '../../../checklist.types';
import ChecklistActivity from './Activity/Checklist';
import InstructionActivity from './Activity/Instruction';
import MaterialActivity from './Activity/Material';
import MediaActivity from './Activity/Media';
import MultiSelectActivity from './Activity/MultiSelect';
import ShouldBeActivity from './Activity/ShouldBe';
import TextboxActivity from './Activity/Textbox';
import YesNoActivity from './Activity/YesNo';
import { Wrapper } from './styles';
import { ActivityListViewProps } from './types';

const ActivityListView: FC<ActivityListViewProps> = ({ activities }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      {activities.map((activity, index) => (
        <div className="activity" key={index}>
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
                // Done, execute action integration pending
                case ActivityType.CHECKLIST:
                  return <ChecklistActivity activity={activity} />;

                // Parcel build compilation is failing
                case ActivityType.INSTRUCTION:
                  return <InstructionActivity activity={activity} />;

                // Completely Done.
                case ActivityType.MATERIAL:
                  return <MaterialActivity activity={activity} />;

                case ActivityType.MEDIA:
                  return <MediaActivity activity={activity} />;

                // Done, execute action integration is pending
                case ActivityType.MULTISELECT:
                  return <MultiSelectActivity activity={activity} />;

                // Done, execution state is left => design pending
                case ActivityType.SHOULD_BE:
                  return <ShouldBeActivity activity={activity} />;

                // Completely Done by Ashish
                case ActivityType.SIGNATURE:
                  return `signature ${activity.id}`;

                // Done, execute action integratio is pending
                case ActivityType.TEXTBOX:
                  return <TextboxActivity activity={activity} />;

                // Completely Done
                case ActivityType.YES_NO:
                  return <YesNoActivity activity={activity} />;

                default:
                  return null;
              }
            })()}
          </div>
        </div>
      ))}
    </Wrapper>
  );
};

export default ActivityListView;
