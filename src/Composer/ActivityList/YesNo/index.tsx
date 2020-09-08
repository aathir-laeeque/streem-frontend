import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { get } from 'lodash';

import { ActivityProps, Selections } from '../types';
import { Wrapper } from './styles';
import { useDispatch } from 'react-redux';
import { executeActivity, fixActivity } from '../actions';

const YesNoActivity: FC<ActivityProps> = ({ activity, isCorrectingError }) => {
  const { entity } = useTypedSelector((state) => state.composer);
  const dispatch = useDispatch();

  return (
    <Wrapper>
      {entity === Entity.JOB ? (
        <>
          <div>{activity.label}</div>
          <div className="buttons-container">
            {activity.data
              .sort((a, b) => (a.type > b.type ? -1 : 1))
              .map((el, index) => {
                const isSelected =
                  get(activity?.response?.choices, el.id) ===
                  Selections.SELECTED;

                return (
                  <div key={index} className="button-item">
                    <button
                      className={isSelected ? 'filled' : ''}
                      onClick={() => {
                        const newData = {
                          ...activity,
                          data: activity.data.map((e: any) => ({
                            ...e,
                            status:
                              e.id === el.id
                                ? Selections.SELECTED
                                : Selections.NOT_SELECTED,
                          })),
                        };

                        if (isCorrectingError) {
                          dispatch(fixActivity(newData));
                        } else {
                          dispatch(executeActivity(newData));
                        }
                      }}
                    >
                      {el.name}
                    </button>
                  </div>
                );
              })}
          </div>
        </>
      ) : null}
    </Wrapper>
  );
};

export default YesNoActivity;

// className={`${
//   activity?.response?.choices[el.id] ===
//   ActivitySelections.SELECTED
//     ? 'filled'
//     : ''
// }`}
// onClick={() => {
//   dispatch(
//     executeActivity({
//       ...activity,
//       data: activity.data.map((x) => ({
//         ...x,
//         status:
//           x.id === el.id
//             ? ActivitySelections.SELECTED
//             : ActivitySelections.NOT_SELECTED,
//       })),
//     }),
//   );
// }}
