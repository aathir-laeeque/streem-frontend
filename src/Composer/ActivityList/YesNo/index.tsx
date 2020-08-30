import { Entity } from '#Composer/types';
import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ActivityProps } from '../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  .buttons-container {
    display: flex;
    margin-top: 12px;

    .button-item {
      /* flex: 1;

      &.editing {
        flex: 0;
      } */

      button {
        background-color: transparent;
        cursor: pointer;
        font-size: 14px;
        letter-spacing: 0.16px;
        line-height: 1.29;
        padding: 5px 20px;
      }

      :first-child {
        input {
          background-color: #e1fec0;
          border-bottom-color: #27ae60;

          :active,
          :focus {
            border-color: #27ae60;
          }
        }

        button {
          border: 1px solid #5aa700;
          border-radius: 4px;
          color: #5aa700;

          &.filled {
            color: #ffffff;
            background-color: #427a00;
          }
        }
      }

      :last-child {
        margin-left: 20px;

        input {
          background-color: #ffebeb;
          border-bottom-color: #eb5757;

          :active,
          :focus {
            border-color: #eb5757;
          }
        }

        button {
          border: 1px solid #ff6b6b;
          border-radius: 4px;
          color: #ff6b6b;

          &.filled {
            color: #ffffff;
            background-color: #cc5656;
          }
        }
      }
    }
  }
`;

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
              .map((el, index) => (
                <div key={index} className="button-item">
                  <button>{el.name}</button>
                </div>
              ))}
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
