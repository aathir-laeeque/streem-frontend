import { PARAMETER_OPERATORS } from '#PrototypeComposer/constants';
import { Avatar, Link as GoBack } from '#components';
import { openLinkInNewTab } from '#utils';
import { apiGetJobSummary } from '#utils/apiUrls';
import { request } from '#utils/request';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime, formatDuration } from '#utils/timeUtils';
import { ExceptionReason } from '#views/Job/overlays/CompleteJobWithException';
import { Print } from '@material-ui/icons';
import { RouteComponentProps } from '@reach/router';
import { differenceInSeconds, fromUnixTime } from 'date-fns';
import React, { ReactNode, useEffect, useState } from 'react';
import { CompletedJobStates, Job } from '../ListView/types';
import { Wrapper } from './styles';
import {
  Exception,
  Exceptions,
  ExceptionsIconMapping,
  JobSummary,
  ParameterDeviation,
  Timer,
} from './types';

type SummaryViewProps = RouteComponentProps<{ jobId: Job['id'] }>;

const generateDescription = (exception: Exception): ReactNode => {
  let description: ReactNode;

  switch (exception.type) {
    case 'DURATION_EXCEPTION':
      const { endedAt, maxPeriod, minPeriod, startedAt, timerOperator } = exception.timer as Timer;

      const taskStartTime = fromUnixTime(startedAt);

      const taskCompleteTime = fromUnixTime(endedAt);

      const taskDuration = differenceInSeconds(taskCompleteTime, taskStartTime);

      const deviation = (() => {
        if (timerOperator === 'NOT_LESS_THAN') {
          if (taskDuration > maxPeriod) {
            return taskDuration - maxPeriod;
          } else {
            return taskDuration - minPeriod;
          }
        }
        return taskDuration - maxPeriod;
      })();

      const expectedString =
        timerOperator === 'NOT_LESS_THAN'
          ? `NLT ${formatDuration(minPeriod ?? 0)}`
          : `Complete under ${formatDuration(maxPeriod ?? 0)}`;

      description = (
        <div>
          <span>
            Task Completed {formatDuration(Math.abs(deviation) ?? 0)}{' '}
            {deviation > 0 ? 'late' : 'early'}
          </span>
          <br />
          <span>Expected: {expectedString}</span>
          <br />
          {timerOperator === 'NOT_LESS_THAN' ? (
            <span>Max Time : {formatDuration(maxPeriod ?? 0)}</span>
          ) : null}
        </div>
      );

      break;

    case 'PARAMETER_DEVIATION':
      const {
        parameter: { operator, parameter, uom, value },
        userInput,
      } = exception.parameterDeviation as ParameterDeviation;

      description = (
        <div>
          <span>{parameter} is off limits</span>
          <br />
          <span>
            Expected value : {PARAMETER_OPERATORS.find((el) => el.value === operator)?.label}{' '}
            {value} {uom}
          </span>
          <br />
          <span>
            Observed value : {userInput} {uom}
          </span>
        </div>
      );

      break;

    case 'COMPLETED_WITH_EXCEPTION':
      description = 'Task completed with exception';
      break;

    case 'SKIPPED':
      description = 'Task skipped with remarks';
      break;

    case 'ERROR_CORRECTION':
      description = 'Task data corrected with remarks';
      break;

    case 'YES_NO':
      description = 'Task with a Yes/No Deviation';
      break;

    default:
      description = '';
  }
  return description;
};

const JobSummaryView = ({ jobId }: SummaryViewProps) => {
  const [loading, toggleLoading] = useState(false);
  const [data, setData] = useState<JobSummary | null>(null);

  useEffect(() => {
    (async () => {
      try {
        toggleLoading((val) => !val);
        const response = await request('GET', apiGetJobSummary(jobId as string));

        if (response.data) {
          setData(response.data);
          toggleLoading((val) => !val);
        } else {
          console.error('error in api response :: ', response?.errors);
          toggleLoading((val) => !val);
        }
      } catch (error) {
        console.error('error occurred in api call :: ', error);
        toggleLoading((val) => !val);
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else if (data) {
    return (
      <Wrapper>
        <GoBack label="Return to process" className="go-back" />

        <div className="page-header">
          <span className="page-header-label">Job Summary</span>
          <div
            className="icon-wrapper"
            onClick={() => openLinkInNewTab(`/jobs/${jobId as string}/summary/print`)}
          >
            <Print className="icon print" />
          </div>
        </div>

        <div className="job-meta-data">
          <div className="card">
            <div className="card-header">Job Started on</div>
            <div className="card-body">
              {data.startedAt ? formatDateTime({ value: data.startedAt }) : 'N/A'}
            </div>
          </div>
          <div className="card">
            <div className="card-header">Job Completed on</div>
            <div className="card-body">
              {data.endedAt ? formatDateTime({ value: data.endedAt }) : 'N/A'}
            </div>
          </div>
          <div className="card">
            <div className="card-header">Job Duration</div>
            <div className="card-body">
              {data.totalDuration ? formatDuration(data.totalDuration) : 'N/A'}
            </div>
          </div>
          <div className="card">
            <div className="card-header">Total Exceptions</div>
            <div className="card-body exception">{data.totalTaskExceptions ?? 0}</div>
          </div>
        </div>

        {data.state === CompletedJobStates['COMPLETED_WITH_EXCEPTION'] ? (
          <div className="job-cwe">
            <div className="job-cwe-label">This Job is completed with Exception</div>

            <div className="job-cwe-details">
              <span className="job-cwe-details-label">Reason for Exception</span>
              <span className="job-cwe-details-value">
                {ExceptionReason.find((item) => item.value === data.cweDetails?.reason)?.label}
              </span>
              <span className="job-cwe-details-label">Additional Comments</span>
              <span className="job-cwe-details-value">{data.cweDetails?.comment}</span>
              <span className="job-cwe-details-label">Link to attached Document</span>
              <ol className="job-cwe-details-value">
                {data.cweDetails?.medias.map((item) => (
                  <li key={item.id}>
                    <a href={item.link} target="_blank" rel="noreferrer" className="media-link">
                      {item.link}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}

        <div className="duration-summary">
          <div className="duration-summary-label">Duration Summary</div>

          {data.stages.length ? (
            <>
              <div className="job-duration">
                <div className="job-duration-label">Total Stage Duration</div>
                <div className="job-duration-value">
                  {formatDuration(data.totalStageDuration ?? 0)}
                </div>
              </div>
              <table className="duration-detail-table">
                <thead>
                  <tr>
                    <th className="name">Stage Name</th>
                    <th className="stage-duration">Stage Duration</th>
                    <th className="task-duration">Task Duration (Avg)</th>
                    <th className="exceptions">Exceptions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stages.map((stage) => (
                    <tr key={stage.id}>
                      <td className="name">
                        <div className="container">
                          <span className="stage-order">Stage {stage.orderTree}</span>
                          <span className="stage-name">{stage.name}</span>
                        </div>
                      </td>
                      <td className="stage-duration">{formatDuration(stage.totalDuration ?? 0)}</td>
                      <td className="task-duration">
                        {formatDuration(stage.averageTaskCompletionDuration ?? 0)}
                      </td>
                      <td className={`exceptions${stage.totalTaskExceptions ? ' colored' : ''}`}>
                        {stage.totalTaskExceptions ? stage.totalTaskExceptions : '-'}
                      </td>
                    </tr>
                  ))}

                  <tr className="total-value-row">
                    <td className="name">Total</td>
                    <td className="stage-duration">
                      {formatDuration(data.totalStageDuration ?? 0)}
                    </td>
                    <td className="task-duration">-</td>
                    <td className={`exceptions${data.totalTaskExceptions ? ' colored' : ''}`}>
                      {data.totalTaskExceptions}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <div className="no-summary">
              There is no duration summary. Job was completed with exception
            </div>
          )}
        </div>

        <div className="exception-summary">
          <div className="exception-summary-label">Exception Summary</div>

          {data.stages.length ? (
            <>
              <div className="exception-details">
                <div className="exception-details-label">Total No. of Exceptions</div>
                <div className="exception-details-value">{data.totalTaskExceptions}</div>
              </div>

              <table className="exceptions-detail-table">
                <thead>
                  <tr>
                    <th className="name">Stage/Task Name</th>
                    <th className="exception-type">Type of Exception</th>
                    <th className="description">Description</th>
                    <th className="initiator">Initiator</th>
                    <th className="user-remarks">User Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stages.map((stage) => {
                    if (stage.totalTaskExceptions) {
                      return (
                        <React.Fragment key={stage.id}>
                          <tr key={stage.id} className="stage-detail">
                            <td className="name">
                              <div className="container">
                                <span className="order">Stage {stage.orderTree}</span>
                                <span className="name">{stage.name}</span>
                              </div>
                            </td>
                            <td className="exception-type"></td>
                            <td className="description"></td>
                            <td className="initiator"></td>
                            <td className="user-remarks"></td>
                          </tr>

                          {stage.tasks.map((task) => {
                            if (task.exceptions.length) {
                              return task.exceptions.map((exception, index) => (
                                <tr className="exception-detail" key={`exception-${index}`}>
                                  <td className="name">
                                    {index === 0 ? (
                                      <div className="container">
                                        <span className="order">
                                          Task {stage.orderTree}.{task.orderTree}
                                        </span>
                                        <span className="name">{task.name}</span>
                                      </div>
                                    ) : null}
                                  </td>
                                  <td className="exception-type">
                                    <div className="container">
                                      <span className="exception-icon">
                                        {ExceptionsIconMapping[exception.type]}
                                      </span>
                                      <span className="exception-name">
                                        {Exceptions[exception.type]}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="description">{generateDescription(exception)}</td>
                                  <td className="initiator">
                                    <div className="initiator-detail">
                                      <Avatar user={exception.initiator} size="large" />
                                      <div className="user-detail">
                                        <span className="user-id">
                                          {exception.initiator.employeeId}
                                        </span>
                                        <span className="user-name">
                                          {getFullName(exception.initiator)}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="user-remarks">{exception.remark}</td>
                                </tr>
                              ));
                            }

                            return null;
                          })}
                        </React.Fragment>
                      );
                    }

                    return null;
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div className="no-summary">
              There is no exception summary. Job was completed with exception
            </div>
          )}
        </div>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default JobSummaryView;
