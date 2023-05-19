import { TargetEntityType } from '#PrototypeComposer/checklist.types';
import { Button, LoadingContainer, StyledTabs, useDrawer } from '#components';
import { apiJobInfo } from '#utils/apiUrls';
import { request } from '#utils/request';
import { ReadOnlyGroup } from '#views/Ontology/ObjectTypes';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { RRule } from 'rrule';
import styled from 'styled-components';
import { getParameterContent } from '#utils/parameterUtils';

const JobInfoDrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;

  .job-summary {
    margin-bottom: 16px;
    border-bottom: 1.5px solid #e0e0e0;
    :last-child {
      border-bottom: none;
    }
    h4 {
      font-size: 14px;
      font-weight: bold;
      line-height: 1.14;
      letter-spacing: 0.16px;
      color: #161616;
      margin-block: 16px;
    }
    .read-only-group {
      padding: 0;
      .read-only {
        margin-bottom: 16px;
        flex-direction: column;
        .content {
          ::before {
            display: none;
          }
          font-size: 12px;
          line-height: 1.33;
          letter-spacing: 0.32px;
          color: #525252;

          :last-child {
            font-size: 14px;
            line-height: 1.14;
            letter-spacing: 0.16px;
            color: #161616;
            padding-top: 4px;
          }
        }
      }
    }
    .scheduler-heading {
      display: flex;
      justify-content: space-between;
      margin-block: 16px;
      button {
        padding: 0;
        svg {
          margin-right: 4px;
          font-size: 14px;
        }
      }
      h4 {
        margin-block: 0;
      }
    }
    .no-schedule {
      font-size: 14px;
      line-height: 1.14;
      letter-spacing: 0.16px;
      color: #c2c2c2;
    }
  }

  .parameters-tabs {
    flex: 0;
  }

  .parameters-tabs-list {
  }

  .parameters-tabs-panel {
    padding: 24px 0 0;
  }
`;

const JobInfoDrawer: FC<{
  job: any;
  onCloseDrawer: any;
}> = ({ onCloseDrawer, job }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [jobInfo, setJobInfo] = useState<any>();

  const fetchJobInfo = async () => {
    try {
      const { data } = await request('GET', apiJobInfo(job.id));
      if (data) setJobInfo(data);
    } catch (e) {
      console.error('Error while fetching job info for JOB ID :: ', job.id, e);
    }
  };

  useEffect(() => {
    fetchJobInfo();
  }, []);

  const getDueOnSummary = () => {
    if (job.jobScheduler.dueDateDuration) {
      const { isValid, values } = Object.entries(job.jobScheduler.dueDateDuration).reduce<any>(
        (acc, [key, value]: any) => {
          if (value) {
            acc.isValid = true;
            acc.values.push(` ${value} ${value > 1 ? `${key}s` : key}`);
          }
          return acc;
        },
        { isValid: false, values: [] },
      );
      if (isValid) {
        return [
          {
            label: 'Due in',
            value: values.join() + ' from Start',
          },
        ];
      }
    }
    return [];
  };

  const getRecurrenceSummary = () => {
    try {
      if (job.jobScheduler.recurrenceRule) {
        const rule = RRule.fromString(job.jobScheduler.recurrenceRule);
        let recurrenceString = rule?.toText() || null;
        if (recurrenceString) {
          const freq = job.jobScheduler.recurrenceRule.match('FREQ=([^;]*)')[1];
          if (job.jobScheduler.customRecurrence) {
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
          return [
            {
              label: 'Recurrence',
              value: recurrenceString,
            },
          ];
        }
      }
      return [];
    } catch (e) {
      console.error('Error while creating recurrence string', e);
      return [];
    }
  };

  const sections = [
    {
      label: 'Summary',
      value: '0',
      panelContent: <div />,
      renderFn: () => {
        return (
          <LoadingContainer
            loading={!jobInfo}
            component={
              jobInfo && (
                <div>
                  <div className="job-summary">
                    <h4>Process Information</h4>
                    <ReadOnlyGroup
                      className="read-only-group"
                      items={[
                        {
                          label: 'Process Name',
                          value: jobInfo.checklist.name,
                        },
                        ...(jobInfo.checklist.properties || []).map((property: any) => ({
                          label: property.label,
                          value: property.value,
                        })),
                      ]}
                    />
                  </div>
                  <div className="job-summary">
                    <h4>Job Information</h4>
                    <ReadOnlyGroup
                      className="read-only-group"
                      items={[
                        {
                          label: 'Job ID',
                          value: jobInfo.code,
                        },
                        ...(jobInfo.parameterValues || []).reduce((acc: any, parameter: any) => {
                          if (parameter.targetEntityType === TargetEntityType.PROCESS) {
                            acc.push({
                              label: parameter.label,
                              value: getParameterContent(parameter),
                            });
                          }
                          return acc;
                        }, []),
                      ]}
                    />
                  </div>
                </div>
              )
            }
          />
        );
      },
    },
    {
      label: 'Schedule',
      value: '1',
      panelContent: <div />,
      renderFn: () => {
        return (
          <LoadingContainer
            loading={!jobInfo}
            component={
              jobInfo && (
                <div>
                  <div className="job-summary">
                    <div className="scheduler-heading">
                      <h4>Schedule</h4>
                    </div>
                    {job.jobScheduler ? (
                      <ReadOnlyGroup
                        className="read-only-group"
                        items={[
                          {
                            label: 'Start Date and Time',
                            value: moment
                              .unix(job.expectedStartDate)
                              .format('Do MMMM, YYYY [at] hh:mm A'),
                          },
                          ...getDueOnSummary(),
                          ...getRecurrenceSummary(),
                        ]}
                      />
                    ) : (
                      <div className="no-schedule">Job is not scheduled</div>
                    )}
                  </div>
                </div>
              )
            }
          />
        );
      },
    },
  ];

  useEffect(() => {
    setDrawerOpen(true);
  }, [onCloseDrawer]);

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      onCloseDrawer(undefined);
    }, 200);
  };

  const onTabChange = (value: string) => {
    setActiveStep(parseInt(value));
  };

  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: 'Job Info',
    hideCloseIcon: true,
    bodyContent: (
      <JobInfoDrawerWrapper>
        <StyledTabs
          containerProps={{
            className: 'parameters-tabs',
          }}
          tabListProps={{
            className: 'parameters-tabs-list',
          }}
          panelsProps={{
            className: 'parameters-tabs-panel',
          }}
          activeTab={activeStep.toString()}
          onChange={onTabChange}
          tabs={sections}
        />
        {sections.map((section) => {
          return activeStep === parseInt(section.value) ? section.renderFn() : null;
        })}
      </JobInfoDrawerWrapper>
    ),
    footerContent: (
      <Button variant="secondary" style={{ marginLeft: 'auto' }} onClick={handleCloseDrawer}>
        Cancel
      </Button>
    ),
    footerProps: {
      style: {
        justifyContent: 'flex-start',
      },
    },
  });

  return <JobInfoDrawerWrapper>{StyledDrawer}</JobInfoDrawerWrapper>;
};

export default JobInfoDrawer;
