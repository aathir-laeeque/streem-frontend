import { Parameter } from '#PrototypeComposer/checklist.types';
import recurrenceIcon from '#assets/svg/Recurrence.svg';
import { getParameterContent } from '#utils/parameterUtils';
import { checkJobExecutionDelay, formatDateTime } from '#utils/timeUtils';
import { LabelValueRow } from '#views/Job/components/Header/styles';
import { Tooltip, withStyles } from '@material-ui/core';
import { ArrowForward, ChevronLeft } from '@material-ui/icons';
import { navigate } from '@reach/router';
import { getUnixTime } from 'date-fns';
import { capitalize } from 'lodash';
import React, { FC } from 'react';
import { Frequency, RRule } from 'rrule';
import styled from 'styled-components';
import { Job } from '../ListView/types';

const JobCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  gap: 16px;
  .job-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    border: 1px solid #e0e0e0;
    position: relative;
    .job-row-section {
      display: flex;
      max-width: calc(100% - 52px);
      &.left {
        flex: 1;
        flex-direction: column;
        gap: 8px;
        padding: 16px 16px 8px 16px;
        height: 100%;
        .job-row-section-left {
          display: flex;
          &.top {
            .job-name {
              margin: 0;
              font-weight: 400;
              font-size: 14px;
              line-height: 16px;
              letter-spacing: 0.16px;
              color: #1d84ff;
              cursor: pointer;
            }
            .job-type {
              font-size: 12px;
              margin: 0 0 0 12px;
              font-weight: 400;
              line-height: 16px;
              letter-spacing: 0.16px;
              color: #6f6f6f;
            }

            .schedule-info {
              margin-left: auto;
              display: flex;
              align-items: center;
              gap: 8px;
              span {
                font-weight: 400;
                font-size: 12px;
                line-height: 12px;
                letter-spacing: 0.32px;
                color: #161616;
                &.primary {
                  color: #1d84ff;
                  cursor: pointer;
                }
              }
              .icon {
                padding: 2px;
                background: #e0e0e0;
                border-radius: 50%;

                svg {
                  font-size: 12px;
                }
              }
              .primary {
                cursor: pointer;
                color: #1d84ff;

                :hover {
                  color: #1d84ff;
                }
              }
            }
          }
        }
      }
      &.right {
        width: 36px;
        height: 100px;
        background-color: #f4f4f4;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
    }
  }
  .job-list-empty {
    margin: auto;
    color: #bbbbbb;
    line-height: 1.5;
  }
`;

const CustomTooltip = withStyles({
  tooltip: {
    width: '205px',
    backgroundColor: '#393939',
    borderRadius: '0px',
    color: '#c2c2c2',
    textAlign: 'left',
    fontSize: '14px',
  },
  arrow: {
    color: '#393939',
  },
})(Tooltip);

const getRecurrenceSummary = (job: Job) => {
  try {
    if (job?.scheduler?.recurrenceRule && job.expectedStartDate) {
      const rule = RRule.fromString(job?.scheduler?.recurrenceRule);
      let recurrenceString = rule?.toText() || null;
      if (recurrenceString) {
        const freq = job?.scheduler?.recurrenceRule.match('FREQ=([^;]*)')[1];
        if (job?.scheduler?.customRecurrence) {
          switch (freq) {
            case 'DAILY':
            case 'WEEKLY':
            case 'MONTHLY':
              recurrenceString = `Repeat ${recurrenceString} at ${formatDateTime({
                value: job.expectedStartDate!,
                format: 'hh:mm a',
              })}`;
              break;
            case 'YEARLY':
              recurrenceString = `Repeat ${recurrenceString} on ${formatDateTime({
                value: job.expectedStartDate!,
                format: `do MMMM 'at' hh:mm a`,
              })}`;
              break;

            default:
              break;
          }
        } else {
          switch (freq) {
            case 'DAILY':
              recurrenceString = `Repeat ${recurrenceString} at ${formatDateTime({
                value: job.expectedStartDate!,
                format: 'hh:mm a',
              })}`;
              break;
            case 'WEEKLY':
              recurrenceString = `Repeat ${recurrenceString} on ${formatDateTime({
                value: job.expectedStartDate!,
                format: `iiii 'at' hh:mm a`,
              })}`;
              break;
            case 'MONTHLY':
              recurrenceString = `Repeat ${recurrenceString} on ${formatDateTime({
                value: job.expectedStartDate!,
                format: `do 'at' hh:mm a`,
              })}`;
              break;
            case 'YEARLY':
              recurrenceString = `Repeat ${recurrenceString} on ${formatDateTime({
                value: job.expectedStartDate!,
                format: `do MMMM 'at' hh:mm a`,
              })}`;
              break;

            default:
              break;
          }
        }

        return recurrenceString;
      }
    }
    return '';
  } catch (e) {
    console.error('Error while creating recurrence string', e);
    return [];
  }
};

const JobCard: FC<{
  jobs: Job[];
  view: string;
  onSetDate?: (jobId: string) => void;
  setSelectedJob: React.Dispatch<React.SetStateAction<Job | undefined>>;
}> = ({ jobs, view, onSetDate, setSelectedJob }) => {
  return (
    <JobCardWrapper className="job-list">
      {jobs.length > 0 ? (
        jobs.map((job) => {
          const actualStartDate = job?.startedAt || getUnixTime(new Date());
          const actualEndDate = job?.endedAt || getUnixTime(new Date());
          let rule;
          let rRuleOptions;
          let frequency;

          if (job?.scheduler) {
            rule = RRule?.fromString(job?.scheduler?.recurrenceRule);
            rRuleOptions = rule?.origOptions;
            frequency =
              Object?.keys(Frequency)[Object?.values(Frequency)?.indexOf(rRuleOptions?.freq!)];
          }

          return (
            <div className="job-row" key={job.id}>
              <div className="job-row-section left">
                <div className="job-row-section-left top">
                  <h5
                    className="job-name"
                    onClick={() => navigate(`/${view === 'Jobs' ? 'jobs' : 'inbox'}/${job.id}`)}
                  >
                    {job.checklist.name}
                  </h5>
                  <h5 className="job-type">{job.checklist.global ? 'Global' : 'Local'}</h5>
                  {job.expectedStartDate && job.expectedEndDate ? (
                    <div className="schedule-info">
                      {frequency && <span>{capitalize(frequency)}</span>}
                      {job?.scheduler && (
                        <CustomTooltip
                          title={
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                padding: '2px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <span style={{ fontSize: '12px' }}>Scheduler Name</span>
                                <span>{job.scheduler.name}</span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <span style={{ fontSize: '12px' }}>Start Date and Time</span>
                                <span>
                                  {formatDateTime({
                                    value: job.expectedStartDate,
                                    format: `do MMMM, yyyy 'at' hh:mm a`,
                                  })}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',

                                  flexDirection: 'column',
                                }}
                              >
                                <span style={{ fontSize: '12px' }}>End Date and Time</span>
                                <span>
                                  {formatDateTime({
                                    value: job.expectedEndDate,
                                    format: `do MMMM, yyyy 'at' hh:mm a`,
                                  })}
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <span style={{ fontSize: '12px' }}>Recurrence</span>
                                <span>{getRecurrenceSummary(job)}</span>
                              </div>
                            </div>
                          }
                          arrow
                        >
                          <img className="icon" src={recurrenceIcon} alt="recurrence-icon" />
                        </CustomTooltip>
                      )}
                      <span
                        style={{
                          color: checkJobExecutionDelay(actualStartDate, job.expectedStartDate)
                            ? '#da1e28'
                            : '#161616',
                        }}
                      >
                        {formatDateTime({
                          value: job.expectedStartDate,
                          format: 'MMM dd, yyyy hh:mm a',
                        })}
                      </span>
                      <span className="icon">
                        <ArrowForward />
                      </span>
                      <span
                        style={{
                          color: checkJobExecutionDelay(actualEndDate, job.expectedEndDate)
                            ? '#da1e28'
                            : '#161616',
                        }}
                      >
                        {formatDateTime({
                          value: job.expectedEndDate,
                          format: 'MMM dd, yyyy hh:mm a',
                        })}
                      </span>
                    </div>
                  ) : onSetDate ? (
                    <div className="schedule-info">
                      <span className="primary" onClick={() => onSetDate(job.id)}>
                        Set Date
                      </span>
                      <span className="icon">
                        <ArrowForward />
                      </span>
                      <span className="primary" onClick={() => onSetDate(job.id)}>
                        Set Date
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="job-row-section-left bottom">
                  <LabelValueRow>
                    {(job?.parameterValues || [])
                      .sort((a: Parameter, b: Parameter) => a.orderTree - b.orderTree)
                      .slice(0, 5)
                      .map((parameter: Parameter) => {
                        if (parameter?.response?.hidden) return null;
                        const value = getParameterContent(parameter);
                        return (
                          <div className="info-item" key={parameter.label}>
                            <label className="info-item-label">{parameter.label}</label>
                            <span className="info-item-value" title={value}>
                              {value}
                            </span>
                          </div>
                        );
                      })}
                  </LabelValueRow>
                </div>
              </div>
              <div
                className="job-row-section right"
                onClick={() => {
                  setSelectedJob(job);
                }}
                style={{
                  height: job?.parameterValues?.length ? 100 : 50,
                }}
              >
                <ChevronLeft />
              </div>
            </div>
          );
        })
      ) : (
        <div className="job-list-empty">No Jobs Found</div>
      )}
    </JobCardWrapper>
  );
};

export default JobCard;
