import { Button, FormGroup, StyledTabs, ToggleSwitch, useDrawer } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ActivityType } from '#JobComposer/checklist.types';
import {
  addNewActivity,
  deleteActivitySuccess,
  toggleNewParameter,
  updateActivityApi,
} from '#PrototypeComposer/Activity/actions';
import { generateNewActivity } from '#PrototypeComposer/Activity/utils';
import {
  Activity,
  Checklist,
  MandatoryActivity,
  NonMandatoryActivity,
} from '#PrototypeComposer/checklist.types';
import { ParameterTypeMap, TargetEntityTypeVisual } from '#PrototypeComposer/constants';
import ResourceFilter from '#PrototypeComposer/Parameters/FilterViews/Resource';
import CalculationParameter from '#PrototypeComposer/Parameters/SetupViews/Calculation';
import ChecklistParameter from '#PrototypeComposer/Parameters/SetupViews/Checklist';
import ResourceParameter from '#PrototypeComposer/Parameters/SetupViews/Resource';
import ParameterParameter from '#PrototypeComposer/Parameters/SetupViews/Parameter';
import YesNoParameter from '#PrototypeComposer/Parameters/SetupViews/YesNo';
import TextInstruction from '#PrototypeComposer/Parameters/SetupViews/TextInstruction';
import MaterialInstruction from '#PrototypeComposer/Parameters/SetupViews/MaterialInstruction';
import NumberValidation from '#PrototypeComposer/Parameters/ValidationViews/Number';
import ResourceValidation from '#PrototypeComposer/Parameters/ValidationViews/Resource';
import { useTypedSelector } from '#store';
import { apiDeleteActivity, apiSingleActivity } from '#utils/apiUrls';
import { InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { Step, StepIconProps, StepLabel, Stepper } from '@material-ui/core';
import {
  CheckCircleOutline,
  DeleteOutlined,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { resetTaskActivityError } from './actions';

export const AddParameterWrapper = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;

  .form-group {
    padding: 0;
    margin-bottom: 24px;

    :last-of-type {
      margin-bottom: 0;
    }
  }

  .toggle-switch {
    margin: 0;
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

const StepperWrapper = styled(Stepper)`
  display: flex;
  padding: 24px 0 !important;
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

const isFiltersAllowed = (type: ActivityType) => {
  switch (type) {
    // case MandatoryActivity.RESOURCE:
    //   return true;
    default:
      return false;
  }
};

const isValidationsAllowed = (type: ActivityType) => {
  switch (type) {
    case MandatoryActivity.RESOURCE:
    case MandatoryActivity.NUMBER:
      return true;
    default:
      return false;
  }
};

const defaultValues = {
  mandatory: true,
  label: '',
  description: '',
  type: undefined,
  validations: {},
};

const AddParameter: FC = () => {
  const dispatch = useDispatch();
  const {
    data,
    activities: { activityOrderInTaskInStage, listById, addParameter },
    stages: { activeStageId },
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);
  const [activeStep, setActiveStep] = useState(0);
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [activityOptions, setActivityOptions] = useState<
    { label: string | JSX.Element; value: string }[]
  >([]);
  const form = useForm<{
    mandatory: boolean;
    label: string;
    description: string;
    type: ActivityType;
    data: any;
    validations: Record<string, any>;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      ...defaultValues,
      ...(addParameter?.type && {
        type: addParameter.type,
      }),
    },
  });

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    setValue,
    watch,
    getValues,
    errors,
    reset,
  } = form;

  register('mandatory');
  register('type', {
    required: true,
  });

  const { mandatory, label, type } = watch(['mandatory', 'label', 'type']);

  // console.log('errors', errors);
  // console.log('getValues', getValues());
  // console.log('isDirty, isValid', isDirty, isValid);
  const showFiltersSection = isFiltersAllowed(type);
  const showValidationsSection = isValidationsAllowed(type);

  const basicInfoSection = (isActive: boolean) => {
    return (
      <FormGroup
        {...(!isActive && {
          style: { display: 'none' },
        })}
        key="basic-info-section"
        inputs={[
          {
            type: InputTypes.MULTI_LINE,
            props: {
              placeholder: 'Write here',
              label: 'Description',
              id: 'description',
              name: 'description',
              rows: 3,
              optional: true,
              ref: register,
            },
          },
        ]}
      />
    );
  };

  const setupSection = (isActive: boolean) => {
    return (
      <div
        style={{
          height: '100%',
          display: isActive ? 'block' : 'none',
        }}
        key="setup-section"
      >
        {(!type || (type in MandatoryActivity && type !== MandatoryActivity.CHECKLIST)) && (
          <FormGroup
            style={{ marginBottom: 24 }}
            inputs={[
              {
                type: InputTypes.SINGLE_SELECT,
                props: {
                  id: 'type',
                  label: 'Parameter Type',
                  options: activityOptions,
                  isSearchable: false,
                  placeholder: 'Select Parameter Type',
                  value: type ? [{ label: ParameterTypeMap[type], value: type }] : undefined,
                  onChange: (option: { value: string }) => {
                    setValue('type', option.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  },
                },
              },
            ]}
          />
        )}
        {!(type in NonMandatoryActivity) && (
          <ToggleSwitch
            height={24}
            width={48}
            offLabel="Optional"
            onColor="#24a148"
            onChange={(isChecked) => {
              setValue('mandatory', isChecked, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            onLabel="Required"
            value={mandatory}
          />
        )}
        {renderSetupViewsByType()}
      </div>
    );
  };

  const renderSetupViewsByType = () => {
    switch (type) {
      case MandatoryActivity.SINGLE_SELECT:
      case MandatoryActivity.MULTISELECT:
      case MandatoryActivity.CHECKLIST:
        return <ChecklistParameter form={form} />;
      case MandatoryActivity.YES_NO:
        return <YesNoParameter form={form} />;
      case MandatoryActivity.CALCULATION:
        return <CalculationParameter form={form} />;
      case MandatoryActivity.RESOURCE:
        return <ResourceParameter form={form} />;
      case MandatoryActivity.PARAMETER:
        return <ParameterParameter form={form} />;
      case NonMandatoryActivity.INSTRUCTION:
        return <TextInstruction form={form} />;
      case NonMandatoryActivity.MATERIAL:
        return <MaterialInstruction form={form} />;
      default:
        return null;
    }
  };

  const filtersSection = (isActive: boolean) => {
    return (
      <div
        {...(!isActive && {
          style: { display: 'none' },
        })}
        key="filters-section"
      >
        {renderFiltersByType()}
      </div>
    );
  };

  const renderFiltersByType = () => {
    switch (type) {
      case MandatoryActivity.RESOURCE:
        return <ResourceFilter form={form} />;
      default:
        return null;
    }
  };

  const validationsSection = (isActive: boolean) => {
    return (
      <div
        {...(!isActive && {
          style: { display: 'none' },
        })}
        key="validations-section"
      >
        {renderValidationsByType()}
      </div>
    );
  };

  const renderValidationsByType = () => {
    switch (type) {
      case MandatoryActivity.RESOURCE:
        return <ResourceValidation form={form} />;
      case MandatoryActivity.NUMBER:
        return <NumberValidation form={form} />;
      default:
        return null;
    }
  };

  const locationSection = (isActive: boolean) => {
    return (
      <div
        {...(!isActive && {
          style: { display: 'none' },
        })}
        key="location-section"
      >
        {currentActivity?.targetEntityType
          ? TargetEntityTypeVisual[currentActivity.targetEntityType]
          : ''}
      </div>
    );
  };

  const sections =
    type in NonMandatoryActivity
      ? [
          {
            label: 'Setup',
            value: '0',
            panelContent: <div />,
            renderFn: setupSection,
          },
        ]
      : [
          {
            label: 'Basic Information',
            value: '0',
            panelContent: <div />,
            renderFn: basicInfoSection,
          },
          {
            label: 'Setup',
            value: '1',
            panelContent: <div />,
            renderFn: setupSection,
          },
          ...(showFiltersSection
            ? [
                {
                  label: 'Filters',
                  description: 'Optional',
                  value: '2',
                  panelContent: <div />,
                  renderFn: filtersSection,
                },
              ]
            : []),
          ...(showValidationsSection
            ? [
                {
                  label: 'Validations',
                  description: 'Optional',
                  value: showFiltersSection ? '3' : '2',
                  panelContent: <div />,
                  renderFn: validationsSection,
                },
              ]
            : []),
          ...(addParameter?.activityId
            ? [
                {
                  label: 'Location',
                  value:
                    showFiltersSection && showValidationsSection
                      ? '4'
                      : showFiltersSection || showValidationsSection
                      ? '3'
                      : '2',
                  panelContent: <div />,
                  renderFn: locationSection,
                },
              ]
            : []),
        ];

  useEffect(() => {
    setActivityOptions(
      Object.entries(ParameterTypeMap).reduce<{ label: string | JSX.Element; value: string }[]>(
        (acc, [value, label]) => {
          if (!(value in NonMandatoryActivity) && value !== MandatoryActivity.CHECKLIST) {
            acc.push({
              label,
              value,
            });
          }
          return acc;
        },
        [],
      ),
    );
  }, []);

  useEffect(() => {
    if (setDrawerOpen && addParameter) {
      setDrawerOpen(!!addParameter);
      setActiveStep(0);
    }

    if (addParameter?.activityId) {
      fetchActivity();
    } else if (addParameter?.type) {
      reset({ ...defaultValues, type: addParameter.type });
    } else {
      reset(defaultValues);
    }
  }, [addParameter]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onTabChange = (value: string) => {
    setActiveStep(parseInt(value));
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      dispatch(toggleNewParameter());
    }, 200);
  };

  const onSubmit = () => {
    if (addParameter) {
      const _data = getValues();
      if (addParameter.activityId && currentActivity) {
        dispatch(
          updateActivityApi(
            {
              ...currentActivity,
              ...(currentActivity.type !== _data.type && {
                ...generateNewActivity({ ...currentActivity, type: _data.type }),
              }),
              ..._data,
            },
            true,
          ),
        );
      } else {
        let orderTree = 1;
        const generatedActivity = generateNewActivity({ orderTree, ..._data });
        if (addParameter.action === 'task' && activeTaskId && activeStageId) {
          const activitiesInTask = activityOrderInTaskInStage?.[activeStageId]?.[activeTaskId];
          const maxOrderTree =
            listById?.[activitiesInTask?.[activitiesInTask?.length - 1]]?.orderTree ?? 0;
          orderTree = maxOrderTree + 1;
          dispatch(resetTaskActivityError(activeTaskId));
          dispatch(
            addNewActivity({
              ...generatedActivity,
              orderTree,
              checklistId: (data as Checklist).id,
              taskId: activeTaskId,
              stageId: activeStageId,
              ..._data,
            }),
          );
        } else {
          dispatch(
            addNewActivity({
              ...generatedActivity,
              checklistId: (data as Checklist).id,
              orderTree,
              ..._data,
            }),
          );
        }
      }
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await request('GET', apiSingleActivity(addParameter!.activityId!));
      if (response.data) {
        setCurrentActivity(response.data);
        reset({
          mandatory: response.data.mandatory,
          label: response.data.label,
          description: response.data.description,
          type: response.data.type,
          data: response.data.data,
          validations: response.data.validations,
        });
      }
    } catch (e) {
      console.error('Error Fetching Activity', e);
    }
  };

  const onDelete = async () => {
    const { data } = await request('PATCH', apiDeleteActivity(addParameter!.activityId!));
    if (data) {
      if (data?.taskId && data?.stageId) {
        dispatch(
          deleteActivitySuccess({
            taskId: data.taskId,
            stageId: data.stageId,
            activityId: addParameter!.activityId!,
          }),
        );
      }
    }
    addParameter?.fetchData && addParameter.fetchData();
    handleCloseDrawer();
  };

  const handleDeleteParameter = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.CONFIRMATION_MODAL,
        props: {
          onPrimary: onDelete,
          primaryText: 'Yes',
          secondaryText: 'No',
          title: 'Delete Parameter',
          body: <>Are you sure you want to Delete this Parameter ?</>,
        },
      }),
    );
  };

  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: addParameter?.title || '',
    bodyContent: (
      <AddParameterWrapper onSubmit={handleSubmit(onSubmit)}>
        <FormGroup
          style={{ marginBlock: 24 }}
          inputs={[
            {
              type: InputTypes.SINGLE_LINE,
              props: {
                placeholder: 'Write here',
                label: 'Label',
                id: 'label',
                name: 'label',
                ref: register({
                  required: true,
                }),
              },
            },
          ]}
        />
        {!(type in NonMandatoryActivity) && (
          <>
            {addParameter?.activityId ? (
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
            ) : (
              <StepperWrapper activeStep={activeStep} alternativeLabel connector={<div />}>
                {sections.map((step, index) => (
                  <StepWrapper key={step.label} active={index <= activeStep}>
                    <StepLabel StepIconComponent={CustomStepIcon}>
                      {step.label}
                      {step.description && (
                        <div className="label-description">{step.description}</div>
                      )}
                    </StepLabel>
                  </StepWrapper>
                ))}
              </StepperWrapper>
            )}
          </>
        )}
        {sections.map((section) => {
          return section.renderFn(activeStep === parseInt(section.value));
        })}
      </AddParameterWrapper>
    ),
    footerContent: (
      <>
        {!addParameter?.activityId && activeStep !== 0 && (
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        )}
        {addParameter?.activityId && (
          <Button variant="textOnly" color="red" onClick={handleDeleteParameter}>
            <DeleteOutlined /> Delete Parameter
          </Button>
        )}
        <Button variant="secondary" style={{ marginLeft: 'auto' }} onClick={handleCloseDrawer}>
          Cancel
        </Button>
        {activeStep === sections.length - 1 ? (
          <Button type="submit" disabled={!isDirty || !isValid} onClick={onSubmit}>
            Save
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={activeStep === 0 ? !label : !isValid}>
            Next
          </Button>
        )}
      </>
    ),
    footerProps: {
      style: {
        justifyContent: 'flex-start',
      },
    },
  });

  return !addParameter ? null : StyledDrawer;
};

export default AddParameter;
