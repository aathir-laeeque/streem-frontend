import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import { Close } from '@material-ui/icons';
import { get } from 'lodash';
import React, { FC } from 'react';

import { ActivityProps, Selections } from '../types';
import { Wrapper } from './styles';

const ChecklistActivity: FC<ActivityProps> = ({ activity }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  if (entity === Entity.JOB) {
    return (
      <Wrapper>
        <ul className="list-container">
          {activity.data.map((el, index) => {
            const isItemSelected =
              get(activity?.response?.choices, el.id) === Selections.SELECTED;

            return (
              <li key={index} className="list-item">
                <div
                  className="item-content"
                  onClick={() =>
                    console.log('dispatch execute activity action')
                  }
                >
                  <div className="dummy-checkbox" />

                  <div className={isItemSelected ? 'selected' : ''}>
                    {el.name}
                  </div>
                </div>

                <Close className="icon" />
              </li>
            );
          })}
        </ul>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default ChecklistActivity;
