import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Job, JobStateEnum } from '../ListView/types';

const Wrapper = styled.div.attrs({
  className: 'list-card-columns',
})`
  .list-state {
    font-size: 12px;
    padding-top: 4px;
    line-height: 0.83;
    display: flex;
    align-items: center;

    .list-state-span {
      font-size: 12px;
      display: flex;
      align-items: center;
      text-transform: capitalize;

      .icon {
        font-size: 12px;
        margin: 0px 4px 0px 0px;
        color: inherit;
      }
    }
  }
`;

const JobCard: FC<{
  item: Job;
  onClick: (item: Job) => void;
}> = ({ item, onClick }) => (
  <Wrapper>
    <div className="title-group">
      <span className="list-code">{item.code}</span>
      <span className="list-title" onClick={() => onClick(item)}>
        {item.checklist.name}
      </span>
      {item.state !== JobStateEnum.UNASSIGNED && (
        <span className="list-state">
          {item.state === JobStateEnum.ASSIGNED && (
            <span
              className="list-state-span"
              style={{
                color: '#ff6b6b',
              }}
            >
              <ErrorOutlineIcon className="icon" />
              {item.state.toLowerCase()}
            </span>
          )}
          {item.state === JobStateEnum.IN_PROGRESS && (
            <span
              className="list-state-span"
              style={{
                color: '#f7b500',
              }}
            >
              <PlayCircleOutlineIcon className="icon" />
              {item.state.toLowerCase()}
            </span>
          )}
          {item.state === JobStateEnum.COMPLETED && (
            <span
              className="list-state-span"
              style={{
                color: '#5aa700',
              }}
            >
              <CheckCircleOutlineIcon className="icon" />
              {item.state.toLowerCase()}
            </span>
          )}
          {item.state === JobStateEnum.COMPLETED_WITH_EXCEPTION && (
            <span
              className="list-state-span"
              style={{
                color: '#5aa700',
              }}
            >
              <CheckCircleOutlineIcon className="icon" />
              Completed With Exception
            </span>
          )}
        </span>
      )}
    </div>
  </Wrapper>
);

export default JobCard;
