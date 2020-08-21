import { AddNewItem } from '#components';
import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import { Close } from '@material-ui/icons';
import React, { FC, useState } from 'react';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const ChecklistActivity: FC<ActivityProps> = ({ activity }) => {
  const [stateActivity, setStateActivity] = useState(activity);

  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      <div className="activity-header">Creating a checklist</div>

      <ul className="list-container">
        {stateActivity.data.map((el, index) => (
          <li key={index} className="list-item">
            <div
              className="item-content"
              onClick={() => {
                if (!isEditing) {
                  console.log('dispatch execute activity action');
                }
              }}
            >
              <div className="dummy-checkbox" />
              <input
                type="text"
                value={el.name}
                onChange={(e) =>
                  setStateActivity({
                    ...stateActivity,
                    data: stateActivity.data.map((x) => ({
                      ...x,
                      ...(x.id === el.id && { name: e.target.value }),
                    })),
                  })
                }
                disabled={!isEditing}
              />
            </div>

            <Close className="icon" />
          </li>
        ))}

        <AddNewItem onClick={() => {}} />
      </ul>
    </Wrapper>
  );
};

export default ChecklistActivity;
