import { AddNewItem } from '#components';
import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import { Close } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { get } from 'lodash';

import { ActivityProps, Selections } from '../types';
import { customSelectStyles } from './commonStyles';
import { Wrapper } from './styles';
import { executeActivity } from '../actions';

const MultiSelectActivity: FC<ActivityProps> = ({ activity }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  const dispatch = useDispatch();

  const isJobsView = entity === Entity.JOB;

  const options = activity.data.map((el) => ({ label: el.name, value: el.id }));

  return (
    <Wrapper isJobsView={isJobsView}>
      <div className="activity-header">Creating a Multi Choice</div>

      <Select
        isMulti
        className="multi-select"
        isDisabled={!isJobsView}
        options={options}
        value={options.filter(
          (el) =>
            get(activity?.response?.choices, el.value) === Selections.SELECTED,
        )}
        placeholder={
          isJobsView
            ? 'Select one more options'
            : 'User can select one or more options'
        }
        styles={customSelectStyles}
        onChange={(options) => {
          dispatch(
            executeActivity({
              ...activity,
              data: activity.data.map((el) => ({
                ...el,
                ...(options.findIndex((e) => e.value === el.id) > -1
                  ? { status: Selections.SELECTED }
                  : { status: Selections.NOT_SELECTED }),
              })),
            }),
          );
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
