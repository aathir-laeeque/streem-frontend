import { AddNewItem } from '#components';
import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import { Close } from '@material-ui/icons';
import React, { FC } from 'react';
import Select from 'react-select';

import { ActivityProps } from '../types';
import { customSelectStyles } from './commonStyles';
import { Wrapper } from './styles';

const MultiSelectActivity: FC<ActivityProps> = ({ activity }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  const isJobsView = entity === Entity.JOB;

  return (
    <Wrapper isJobsView={isJobsView}>
      <div className="activity-header">Creating a Multi Choice</div>

      <Select
        isMulti
        className="multi-select"
        isDisabled={!isJobsView}
        options={activity.data.map((el) => ({
          label: el.name,
          value: el.id,
        }))}
        placeholder={
          isJobsView
            ? 'Select one more options'
            : 'User can select one or more options'
        }
        styles={customSelectStyles}
        onChange={(option) => {
          console.log('option :: ', option);
        }}
      />

      <ul className="list-container">
        {activity.data.map((el, index) => (
          <li key={index} className="list-item">
            <div
              className="item-content"
              // onClick={() => {
              //   if (!isJobsView) {
              //     console.log('dispatch execute activity action');
              //   }
              // }}
            >
              <div className="dummy-checkbox" />
              <input
                type="text"
                value={el.name}
                onChange={(e) =>
                  console.log(
                    'e.target.value from multiselect list item :: ',
                    e.target.value,
                  )
                }
                disabled={!isJobsView}
              />
            </div>

            <Close className="icon" />
          </li>
        ))}

        {isJobsView ? (
          <AddNewItem onClick={() => console.log('add new item')} />
        ) : null}
      </ul>
    </Wrapper>
  );
};

export default MultiSelectActivity;
