import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const YesNoActivity: FC<ActivityProps> = ({ activity }) => {
  const { entity } = useTypedSelector((state) => state.composer);

  return (
    <Wrapper>
      {entity === Entity.JOB ? (
        <>
          <div>{activity.label}</div>
          <div className="buttons-container">
            {activity.data
              .sort((a, b) => (a.type > b.type ? -1 : 1))
              .map((el, index) => {
                return (
                  <div key={index} className="button-item">
                    <button>{el.name}</button>
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
