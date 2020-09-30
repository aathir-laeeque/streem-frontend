import { AddNewItem, TextInput } from '#components';
import { Close } from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC } from 'react';

import { ChecklistWrapper } from './styles';
import { ActivityProps } from './types';

const ChecklistActivity: FC<ActivityProps> = ({ activity }) => {
  return (
    <ChecklistWrapper>
      <label>Creating a checklist</label>

      <ul className="checklist-list">
        {activity?.data?.map((item, index) => (
          <li className="checklist-list-item" key={index}>
            <TextInput
              defaultValue={item.name}
              onChange={debounce(({ value }) => {
                console.log('value on update :: ', value);
              }, 500)}
            />

            <Close className="icon" id="remove-item" />
          </li>
        ))}

        <AddNewItem
          onClick={() => {
            console.log('add new item');
          }}
        />
      </ul>
    </ChecklistWrapper>
  );
};

export default ChecklistActivity;
