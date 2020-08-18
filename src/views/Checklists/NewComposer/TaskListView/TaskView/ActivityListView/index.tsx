import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import {
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  MoreVertOutlined,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { ActivityType } from '../../../checklist.types';
import { setActiveActivity } from './actions';
import YesNoActivity from './Activity/YesNo';
import { ActivityListViewProps } from './types';

const Wrapper = styled.div`
  .activity {
    display: grid;

    ${(props) =>
      props.isEditing
        ? css`
            grid-template-areas: 'position-control activity-content activity-icons';
            grid-template-columns: 24px 1fr 24px;
            grid-column-gap: 16px;
          `
        : css`
            grid-template-areas: 'activity-content';
            grid-template-columns: 1fr;
            grid-column-gap: 16px;
          `}

    margin-bottom: 24px;

    :first-child {
      margin-top: 24px;

      .arrow-up {
        visibility: hidden;
      }
    }

    :last-child {
      .arrow-down {
        visibility: hidden;
      }
    }

    &-position-control {
      grid-area: position-control;
    }

    &-content {
      grid-area: activity-content;

      border: 1px solid transparent;
      border-radius: 4px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      padding: 16px;

      &.active {
        border-color: #1d84ff;
      }
    }

    &-icons {
      grid-area: activity-icons;
    }
  }
`;

const ActivityListView: FC<ActivityListViewProps> = ({ activities }) => {
  const {
    composerState,
    tasks: { activeActivityId },
  } = useTypedSelector((state) => state.newComposer);

  const dispatch = useDispatch();

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      {activities.map((activity, index) => (
        <div
          className="activity"
          key={index}
          onClick={() => {
            if (activeActivityId !== activity.id) {
              dispatch(setActiveActivity(activity.id));
            }
          }}
        >
          <div
            className={`activity-position-control${!isEditing ? ' hide' : ''}`}
          >
            <ArrowUpwardOutlined className="icon arrow-up" />
            <ArrowDownwardOutlined className="icon arrow-down" />
          </div>

          <div
            className={`activity-content${
              activeActivityId === activity.id ? ' active' : ''
            }`}
          >
            {(() => {
              switch (activity.type) {
                case ActivityType.MEDIA:
                  return `Media ${activity.id}`;
                case ActivityType.MULTISELECT: // single select activity to be added from BE, support that as well in the component
                  return `MultiSelect ${activity.id}`;
                case ActivityType.SHOULDBE: // will be renamed to parameter activity later
                  return `shouldBe ${activity.id}`;
                case ActivityType.TEXTBOX: // named as comment activity in zeplin
                  return `textBiox ${activity.id}`;
                // Ashish
                case ActivityType.SIGNATURE:
                  return `signature ${activity.id}`;
                // Snehal
                case ActivityType.INSTRUCTION:
                  return `instruction ${activity.id}`;
                case ActivityType.CHECKLIST:
                  return `checklist ${activity.id}`;
                case ActivityType.MATERIAL:
                  return `material ${activity.id}`;
                // case ActivityType.YESNO:
                //   return `yes no ${activity.id}`;

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
