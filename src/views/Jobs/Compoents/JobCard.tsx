import React, { FC } from 'react';
import styled from 'styled-components';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Job } from '#views/Jobs/types';
import { JobStatus } from '#views/Jobs/ListView/types';

const Wrapper = styled.div.attrs({
  className: 'list-card-columns',
})`
  .list-status {
    font-size: 12px;
    padding-top: 4px;
    line-height: 0.83;
    display: flex;
    align-items: center;

    .list-status-span {
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
      {item.status !== JobStatus.UNASSIGNED.toUpperCase() && (
        <span className="list-status">
          {item.status === JobStatus.ASSIGNED.toUpperCase() && (
            <span
              className="list-status-span"
              style={{
                color: '#ff6b6b',
              }}
            >
              <ErrorOutlineIcon className="icon" />
              {item.status.toLowerCase()}
            </span>
          )}
          {item.status === JobStatus.INPROGRESS.toUpperCase() && (
            <span
              className="list-status-span"
              style={{
                color: '#f7b500',
              }}
            >
              <PlayCircleOutlineIcon className="icon" />
              {item.status.toLowerCase()}
            </span>
          )}
          {item.status === JobStatus.COMPLETED.toUpperCase() && (
            <span
              className="list-status-span"
              style={{
                color: '#5aa700',
              }}
            >
              <CheckCircleOutlineIcon className="icon" />
              {item.status.toLowerCase()}
            </span>
          )}
          {item.status === JobStatus.COMPLETED_WITH_EXCEPTION.toUpperCase() && (
            <span
              className="list-status-span"
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
