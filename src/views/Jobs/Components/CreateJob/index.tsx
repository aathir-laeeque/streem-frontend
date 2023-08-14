import { Button, useDrawer } from '#components';
import { useTypedSelector } from '#store';
import { createJob, createJobSuccess, updateJob } from '#views/Jobs/ListView/actions';
import { Step, StepIconProps, StepLabel, Stepper } from '@material-ui/core';
import { CheckCircleOutline, RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { JobForm } from './JobForm';
import { Scheduler } from './Scheduler';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { MandatoryParameter } from '#PrototypeComposer/checklist.types';

const CreateJobDrawerWrapper = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;

  .custom-label {
    align-items: center;
    color: #525252;
    display: flex;
    font-size: 12px;
    justify-content: flex-start;
    letter-spacing: 0.32px;
    line-height: 1.33;
    margin: 0px;
    margin-bottom: 8px;
  }

  .form-group {
    padding: 0;
    margin-bottom: 16px;

    :last-of-type {
      margin-bottom: 0;
    }
  }

  .due-after-section {
    display: flex;
    margin-bottom: 16px;
    .form-group {
      flex-direction: row;
      gap: 0.8%;
      width: 100%;
      > div {
        margin-bottom: 0;
        width: 16%;
        input {
          width: calc(100% - 32px);
        }
      }
    }
  }

  .custom-recurrence-section {
    display: flex;
    margin-bottom: 16px;
    .form-group {
      flex-direction: row;
      gap: 0.8%;
      width: 100%;
      > div {
        margin-bottom: 0;
        flex: 1;
      }
    }
    .week-day-container {
      display: flex;
      .week-day {
        background-color: #f4f4f4;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin-right: 16px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }

  .scheduler-summary {
    border-top: 1.5px solid #e0e0e0;
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
      }
    }
  }
`;

const StepperWrapper = styled(Stepper)`
  display: flex;
  padding: 16px 0 !important;
`;

const StepWrapper = styled(Step)<{ active?: boolean }>`
  border-top: 2px solid ${(p) => (p.active ? '#1d84ff' : '#e0e0e0')};
  padding: 8px 0 !important;

  .MuiStepLabel-root.MuiStepLabel-alternativeLabel {
    align-items: flex-start;
  }

  .MuiStepLabel-label.MuiStepLabel-alternativeLabel {
    margin-top: -20px;
    text-align: left;
    padding-left: 28px;
    font-weight: bold;
    font-family: inherit;
  }

  .label-description {
    font-size: 12px;
    line-height: 1.33;
    letter-spacing: 0.32px;
    color: #525252;
  }
`;

const StepIconWrapper = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;

  svg {
    color: #1d84ff;
    font-size: 20px;
  }
`;

function CustomStepIcon(props: StepIconProps) {
  const { active, completed } = props;

  return (
    <StepIconWrapper active={active}>
      {completed ? (
        <CheckCircleOutline />
      ) : active ? (
        <RadioButtonChecked />
      ) : (
        <RadioButtonUnchecked />
      )}
    </StepIconWrapper>
  );
}

const CreateJobDrawer: FC<{
  onCloseDrawer: React.Dispatch<React.SetStateAction<any>>;
  checklist?: Record<string, string>;
  selectedObject?: any;
}> = ({ onCloseDrawer, checklist, selectedObject }) => {
  const dispatch = useDispatch();
  const {
    jobListView: { submitting, createdData },
    auth: { selectedUseCase },
    prototypeComposer: {
      parameters: {
        parameters: { list: parametersList },
      },
    },
  } = useTypedSelector((state) => state);
  const [activeStep, setActiveStep] = useState(0);
  const form = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const {
    handleSubmit,
    formState: { isDirty, isValid },
    getValues,
  } = form;

  const sections = [
    {
      label: 'Job Details',
      value: '0',
      panelContent: <div />,
      renderFn: () => <JobForm form={form} checklist={checklist} selectedObject={selectedObject} />,
    },
    {
      label: 'Schedule',
      value: '1',
      panelContent: <div />,
      renderFn: () => <Scheduler form={form} />,
    },
  ];

  useEffect(() => {
    setDrawerOpen(true);
  }, [onCloseDrawer]);

  useEffect(() => {
    if (activeStep === 0 && !submitting && createdData) {
      handleNext();
    }
  }, [submitting, createdData]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleCloseDrawer = (shouldReRender = false) => {
    setDrawerOpen(false);
    dispatch(createJobSuccess(undefined, shouldReRender));
    setTimeout(() => {
      onCloseDrawer(false);
    }, 200);
  };

  const handleCreateJob = () => {
    const data = getValues();
    const parameterValues = parametersList.reduce((acc, parameter: any) => {
      if (data[parameter.id]) {
        if (
          [
            MandatoryParameter.NUMBER,
            MandatoryParameter.DATE,
            MandatoryParameter.DATE_TIME,
            MandatoryParameter.SINGLE_LINE,
            MandatoryParameter.MULTI_LINE,
          ].includes(data[parameter.id]?.type)
        ) {
          if (data[parameter.id]?.data?.input && data[parameter.id]?.data?.input !== null) {
            acc[parameter.id] = {
              parameter: data[parameter.id],
              reason: data[parameter?.id]?.response?.reason || '',
            };
          }
        } else if (
          [
            MandatoryParameter.SINGLE_SELECT,
            MandatoryParameter.MULTISELECT,
            MandatoryParameter.YES_NO,
            MandatoryParameter.CHECKLIST,
          ].includes(data[parameter.id]?.type)
        ) {
          if (
            data[parameter.id]?.data?.length > 0 &&
            data[parameter.id]?.data?.some((item) => item.state === 'SELECTED')
          ) {
            acc[parameter.id] = {
              parameter: data[parameter.id],
              reason: data[parameter?.id]?.response?.reason || '',
            };
          }
        } else if (
          Object.keys(data[parameter.id]?.data).length === 0 ||
          (data[parameter.id]?.data?.choices && data[parameter.id]?.data?.choices !== null)
        ) {
          acc[parameter.id] = {
            parameter: data[parameter.id],
            reason: data[parameter?.id]?.response?.reason || '',
          };
        }
      }
      return acc;
    }, {});

    dispatch(
      createJob({
        parameterValues,
        checklistId: data.checklistId,
        selectedUseCaseId: selectedUseCase!.id,
      }),
    );
  };

  const handleScheduleJob = () => {
    const _data = getValues();
    dispatch(
      updateJob({
        job: {
          id: createdData?.id,
          expectedStartDate: moment(_data.expectedStartDate).unix(),
          expectedEndDate: moment(_data.expectedEndDate).unix(),
        },
      }),
    );
    handleCloseDrawer();
  };

  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: 'Create Job',
    hideCloseIcon: true,
    bodyContent: (
      <CreateJobDrawerWrapper onSubmit={handleSubmit(handleCreateJob)}>
        <StepperWrapper activeStep={activeStep} alternativeLabel connector={<div />}>
          {sections.map((step, index) => (
            <StepWrapper key={step.label} active={index <= activeStep}>
              <StepLabel StepIconComponent={CustomStepIcon}>{step.label}</StepLabel>
            </StepWrapper>
          ))}
        </StepperWrapper>
        {sections.map((section) => {
          return activeStep === parseInt(section.value) ? section.renderFn() : null;
        })}
      </CreateJobDrawerWrapper>
    ),
    footerContent:
      activeStep === 0 ? (
        <>
          <Button
            variant="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleCloseDrawer()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleCreateJob}
            disabled={!isDirty || !isValid || submitting}
            loading={submitting}
          >
            Create Job & Continue
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => {
              dispatch(
                showNotification({
                  type: NotificationType.SUCCESS,
                  msg: 'Job is created but not scheduled',
                }),
              );
              handleCloseDrawer();
            }}
          >
            Schedule Later
          </Button>
          <Button type="submit" disabled={!isDirty || !isValid} onClick={handleScheduleJob}>
            Save
          </Button>
        </>
      ),
    footerProps: {
      style: {
        justifyContent: 'flex-start',
      },
    },
  });

  return StyledDrawer;
};

export default CreateJobDrawer;
