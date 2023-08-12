import { Parameter, TargetEntityType } from '#PrototypeComposer/checklist.types';
import { getParameterContent } from '#utils/parameterUtils';
import { Tooltip, withStyles } from '@material-ui/core';
import { capitalize } from 'lodash';
import moment from 'moment';
import React, { FC } from 'react';
import { Frequency, RRule } from 'rrule';
import recurrenceIcon from '#assets/svg/Recurrence.svg';
import { checkJobExecutionDelay, formatDateTime } from '#utils/timeUtils';
import { ArrowForward, ChevronLeft } from '@material-ui/icons';
import { LabelValueRow } from '#JobComposer/Header/styles';
import { navigate } from '@reach/router';
import { Job } from '../ListView/types';

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
    if (job?.scheduler?.recurrenceRule) {
      const rule = RRule.fromString(job?.scheduler?.recurrenceRule);
      let recurrenceString = rule?.toText() || null;
      if (recurrenceString) {
        const freq = job?.scheduler?.recurrenceRule.match('FREQ=([^;]*)')[1];
        if (job?.scheduler?.customRecurrence) {
          switch (freq) {
            case 'DAILY':
            case 'WEEKLY':
            case 'MONTHLY':
              recurrenceString = `Repeat ${recurrenceString} at ${moment
                .unix(job.expectedStartDate)
                .format('hh:mm A')}`;
              break;
            case 'YEARLY':
              recurrenceString = `Repeat ${recurrenceString} on ${moment
                .unix(job.expectedStartDate)
                .format('Do MMMM [at] hh:mm A')}`;
              break;

            default:
              break;
          }
        } else {
          switch (freq) {
            case 'DAILY':
              recurrenceString = `Repeat ${recurrenceString} at ${moment
                .unix(job.expectedStartDate)
                .format('hh:mm A')}`;
              break;
            case 'WEEKLY':
              recurrenceString = `Repeat ${recurrenceString} on ${moment
                .unix(job.expectedStartDate)
                .format('dddd [at] hh:mm A')}`;
              break;
            case 'MONTHLY':
              recurrenceString = `Repeat ${recurrenceString} on ${moment
                .unix(job.expectedStartDate)
                .format('Do [at] hh:mm A')}`;
              break;
            case 'YEARLY':
              recurrenceString = `Repeat ${recurrenceString} on ${moment
                .unix(job.expectedStartDate)
                .format('Do MMMM [at] hh:mm A')}`;
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
    <div className="job-list">
      {jobs.map((job) => {
        const actualStartDate = job?.startedAt || moment().unix();
        const actualEndDate = job?.endedAt || moment().unix();
        let rule;
        let rRuleOptions;
        let frequency;

        if (job?.scheduler) {
          rule = RRule?.fromString(job?.scheduler?.recurrenceRule);
          rRuleOptions = rule?.origOptions;
          frequency =
            Object?.keys(Frequency)[Object?.values(Frequency)?.indexOf(rRuleOptions?.freq)];
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
                                {moment
                                  .unix(job.expectedStartDate)
                                  .format('Do MMMM, YYYY [at] hh:mm A')}
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
                                {moment
                                  .unix(job.expectedEndDate)
                                  .format('Do MMMM, YYYY [at] hh:mm A')}
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
                      {formatDateTime(job.expectedStartDate, 'MMM DD, YYYY hh:mm A')}
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
                      {formatDateTime(job.expectedEndDate, 'MMM DD, YYYY hh:mm A')}
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
                      return (
                        <div className="info-item" key={parameter.label}>
                          <label className="info-item-label">{parameter.label}</label>
                          <span className="info-item-value">{getParameterContent(parameter)}</span>
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
      })}
    </div>
  );
};

export default JobCard;
