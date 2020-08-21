import { AddNewItem } from '#components';
import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import { Close } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import Select from 'react-select';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';
import { customSelectStyles } from '../commonStyles';

const MultiSelectActivity: FC<ActivityProps> = ({ activity }) => {
  const [stateActivity, setStateActivity] = useState(activity);

  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      <div className="activity-header">Creating a Multi Choice</div>

      <Select
        isMulti
        className="multi-select"
        isDisabled={isEditing}
        options={stateActivity.data.map((el) => ({
          label: el.name,
          value: el.id,
        }))}
        placeholder={
          isEditing
            ? 'User can select one or more options'
            : 'Select one more options'
        }
        styles={customSelectStyles}
        onChange={(option) => {
          console.log('option :: ', option);
        }}
      />

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

        {isEditing ? <AddNewItem onClick={() => {}} /> : null}
      </ul>
    </Wrapper>
  );
};

export default MultiSelectActivity;
