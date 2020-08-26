import { AddNewItem } from '#components';
import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import { Close } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';

import { ActivityProps, ActivitySelections } from '../types';
import { Wrapper } from './styles';
import { executeActivity } from '../actions';

const ChecklistActivity: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      <div className="activity-header">Creating a checklist</div>

      <ul className="list-container">
        {activity.data.map((el, index) => {
          const isItemSelected =
            get(activity?.response?.choices, el.id) ===
            ActivitySelections.SELECTED;

          return (
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

                {isEditing ? (
                  <input
                    type="text"
                    value={el.name}
                    onChange={(e) => {
                      console.log('e.target.value');
                    }}
                    disabled={!isEditing}
                  />
                ) : (
                  <div
                    className={
                      get(activity?.response?.choices, el.id) ===
                      ActivitySelections.SELECTED
                        ? 'selected'
                        : ''
                    }
                  >
                    {el.name}
                  </div>
                )}
              </div>

              <Close className="icon" />
            </li>
          );
        })}

        {isEditing ? <AddNewItem onClick={() => {}} /> : null}
      </ul>
    </Wrapper>
  );
};

export default ChecklistActivity;
