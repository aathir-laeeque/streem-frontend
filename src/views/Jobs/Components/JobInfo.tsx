import { Media, Parameter } from '#PrototypeComposer/checklist.types';
import { Button, CustomTag, LoadingContainer, StyledTabs, useDrawer } from '#components';
import { openLinkInNewTab } from '#utils';
import { apiJobInfo, apiSingleProcessScheduler } from '#utils/apiUrls';
import { InputTypes } from '#utils/globalTypes';
import { fileTypeCheck, getParameterContent } from '#utils/parameterUtils';
import { request } from '#utils/request';
import { formatDateTime } from '#utils/timeUtils';
import { ReadOnlyGroup } from '#views/Ontology/ObjectTypes';
import React, { FC, useEffect, useState } from 'react';
import { RRule } from 'rrule';
import styled from 'styled-components';

const JobInfoDrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-height: 0;

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

    .read-only-group-media > .read-only > .content:last-child {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .media-list-item {
      color: #1d84ff;
      font-size: 14px;
      cursor: pointer;
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
  const [schedulerInfo, setSchedulerInfo] = useState<any>(null);

  const fetchJobInfo = async () => {
    try {
      const { data } = await request('GET', apiJobInfo(job.id));
      if (data) setJobInfo(data);
    } catch (e) {
      console.error('Error while fetching job info for JOB ID :: ', job.id, e);
    }
  };

  const fetchSchedulerById = async () => {
    try {
      const { data } = await request('GET', apiSingleProcessScheduler(job.schedulerId));
      if (data) {
        setSchedulerInfo(data);
      }
    } catch (e) {
      console.error('Error Fetching Parameter', e);
    }
  };

  useEffect(() => {
    fetchJobInfo();
    if (job?.schedulerId) {
      fetchSchedulerById();
    }
  }, []);

  const getRecurrenceSummary = () => {
    try {
      if (schedulerInfo?.recurrenceRule) {
        const rule = RRule.fromString(schedulerInfo.recurrenceRule);
        let recurrenceString = rule?.toText() || null;
        if (recurrenceString) {
          const freq = schedulerInfo.recurrenceRule.match('FREQ=([^;]*)')[1];
          if (schedulerInfo.customRecurrence) {
            switch (freq) {
              case 'DAILY':
              case 'WEEKLY':
              case 'MONTHLY':
                recurrenceString = `Repeat ${recurrenceString} at ${formatDateTime({
                  value: job.expectedStartDate,
                  type: InputTypes.TIME,
                })}`;
                break;
              case 'YEARLY':
                recurrenceString = `Repeat ${recurrenceString} on ${formatDateTime({
                  value: job.expectedStartDate,
                })}`;
                break;

              default:
                break;
            }
          } else {
            switch (freq) {
              case 'DAILY':
                recurrenceString = `Repeat ${recurrenceString} at ${formatDateTime({
                  value: job.expectedStartDate,
                  type: InputTypes.TIME,
                })}`;
                break;
              case 'WEEKLY':
                recurrenceString = `Repeat ${recurrenceString} on ${formatDateTime({
                  value: job.expectedStartDate,
                  format: `dddd 'at' hh:mm a`,
                })}`;
                break;
              case 'MONTHLY':
                recurrenceString = `Repeat ${recurrenceString} on ${formatDateTime({
                  value: job.expectedStartDate,
                  format: `do 'at' hh:mm a`,
                })}`;
                break;
              case 'YEARLY':
                recurrenceString = `Repeat ${recurrenceString} on ${formatDateTime({
                  value: job.expectedStartDate,
                  format: `do MMMM 'at' hh:mm a`,
                })}`;
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
                        ...(jobInfo.parameterValues || [])
                          .sort((a: Parameter, b: Parameter) =>
                            a.orderTree > b.orderTree ? 1 : -1,
                          )
                          .reduce((acc: any, parameter: any) => {
                            if (!parameter.response?.hidden) {
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
                  {(jobInfo.state === 'COMPLETED' ||
                    jobInfo.state === 'COMPLETED_WITH_EXCEPTION') &&
                    jobInfo.jobAnnotationDto && (
                      <div className="job-summary">
                        <h4>Annotation Information</h4>
                        <ReadOnlyGroup
                          className="read-only-group"
                          items={[
                            {
                              label: 'Remarks',
                              value: jobInfo.jobAnnotationDto.remarks,
                            },
                          ]}
                        />
                        <ReadOnlyGroup
                          className="read-only-group read-only-group-media"
                          items={[
                            {
                              label: 'Medias',
                              value: jobInfo.jobAnnotationDto.medias.map(
                                (media: Media, index: number) => {
                                  const mediaType = media?.type?.split('/')[1];
                                  const isImage = fileTypeCheck(['png', 'jpg', 'jpeg'], mediaType);
                                  if (media?.archived === false) {
                                    return (
                                      <CustomTag
                                        as={isImage ? 'a' : 'div'}
                                        target={isImage ? '_blank' : undefined}
                                        href={isImage ? media.link : undefined}
                                        key={index}
                                        onClick={
                                          isImage
                                            ? undefined
                                            : () => {
                                                const queryString = new URLSearchParams({
                                                  link: media.link,
                                                }).toString();
                                                openLinkInNewTab(
                                                  `/jobs/${job.id}/fileUpload/print?${queryString}`,
                                                );
                                              }
                                        }
                                      >
                                        <span className="media-list-item">
                                          {media.originalFilename}
                                        </span>
                                      </CustomTag>
                                    );
                                  } else {
                                    return null;
                                  }
                                },
                              ),
                            },
                          ]}
                        />
                      </div>
                    )}
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
                    {job.expectedStartDate && job.expectedEndDate ? (
                      <ReadOnlyGroup
                        className="read-only-group"
                        items={[
                          {
                            label: 'Start Date and Time',
                            value: formatDateTime({
                              value: job.expectedStartDate,
                            }),
                          },
                          {
                            label: 'End Date and Time',
                            value: formatDateTime({
                              value: job.expectedEndDate,
                            }),
                          },
                          ...(schedulerInfo ? getRecurrenceSummary() : []),
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
