import { Button, FormGroup, StyledTabs, ToggleSwitch, useDrawer } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ParameterType } from '#JobComposer/checklist.types';
import {
  addNewParameter,
  deleteParameterSuccess,
  toggleNewParameter,
  updateParameterApi,
} from '#PrototypeComposer/Activity/actions';
import { generateNewParameter } from '#PrototypeComposer/Activity/utils';
import {
  Checklist,
  MandatoryParameter,
  NonMandatoryParameter,
  Parameter,
} from '#PrototypeComposer/checklist.types';
import { ParameterTypeMap, TargetEntityTypeVisual } from '#PrototypeComposer/constants';
import ResourceFilter from '#PrototypeComposer/Parameters/FilterViews/Resource';
import CalculationParameter from '#PrototypeComposer/Parameters/SetupViews/Calculation';
import ChecklistParameter from '#PrototypeComposer/Parameters/SetupViews/Checklist';
import MaterialInstruction from '#PrototypeComposer/Parameters/SetupViews/MaterialInstruction';
import ParameterParameter from '#PrototypeComposer/Parameters/SetupViews/Parameter';
import ResourceParameter from '#PrototypeComposer/Parameters/SetupViews/Resource';
import TextInstruction from '#PrototypeComposer/Parameters/SetupViews/TextInstruction';
import YesNoParameter from '#PrototypeComposer/Parameters/SetupViews/YesNo';
import NumberValidation from '#PrototypeComposer/Parameters/ValidationViews/Number';
import ResourceValidation from '#PrototypeComposer/Parameters/ValidationViews/Resource';
import { useTypedSelector } from '#store';
import { apiDeleteParameter, apiSingleParameter } from '#utils/apiUrls';
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
import { resetTaskParameterError } from './actions';

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

const isFiltersAllowed = (type: ParameterType) => {
  switch (type) {
    case MandatoryParameter.RESOURCE:
      return true;
    default:
      return false;
  }
};

const isValidationsAllowed = (type: ParameterType) => {
  switch (type) {
    case MandatoryParameter.RESOURCE:
    case MandatoryParameter.NUMBER:
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
  autoInitialize: undefined,
  autoInitialized: undefined,
};

const AddParameter: FC<{ isReadOnly: boolean }> = ({ isReadOnly }) => {
  const dispatch = useDispatch();
  const {
    data,
    parameters: { parameterOrderInTaskInStage, listById, addParameter },
    stages: { activeStageId },
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.prototypeComposer);
  const [activeStep, setActiveStep] = useState(0);
  const [currentParameter, setCurrentParameter] = useState<Parameter>();
  const [parameterOptions, setParameterOptions] = useState<
    { label: string | JSX.Element; value: string }[]
  >([]);
  const form = useForm<{
    mandatory: boolean;
    label: string;
    description: string;
    type: ParameterType;
    data: any;
    validations: Record<string, any>;
    autoInitialize: Record<string, any>;
    autoInitialized?: boolean;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      ...defaultValues,
      ...(addParameter?.type && {
        type: addParameter.type,
        ...(addParameter.type in NonMandatoryParameter && {
          mandatory: false,
        }),
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

  const showFiltersSection = isFiltersAllowed(type);
  const showValidationsSection = isValidationsAllowed(type);

  const basicInfoSection = () => {
    return (
      <FormGroup
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
              disabled: isReadOnly,
              ref: register,
            },
          },
        ]}
      />
    );
  };

  const setupSection = () => {
    return (
      <div
        style={{
          height: '100%',
        }}
        key="setup-section"
      >
        {(!type || (type in MandatoryParameter && type !== MandatoryParameter.CHECKLIST)) && (
          <FormGroup
            style={{ marginBottom: 24 }}
            inputs={[
              {
                type: InputTypes.SINGLE_SELECT,
                props: {
                  id: 'type',
                  label: 'Parameter Type',
                  options: parameterOptions,
                  isSearchable: false,
                  placeholder: 'Select Parameter Type',
                  value: type ? [{ label: ParameterTypeMap[type], value: type }] : undefined,
                  isDisabled: isReadOnly || !!addParameter?.parameterId,
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
        {!(type in NonMandatoryParameter) && (
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
            disabled={isReadOnly}
          />
        )}
        {renderSetupViewsByType()}
      </div>
    );
  };

  const renderSetupViewsByType = () => {
    switch (type) {
      case MandatoryParameter.SINGLE_SELECT:
      case MandatoryParameter.MULTISELECT:
      case MandatoryParameter.CHECKLIST:
        return <ChecklistParameter form={form} isReadOnly={isReadOnly} />;
      case MandatoryParameter.YES_NO:
        return <YesNoParameter form={form} isReadOnly={isReadOnly} />;
      case MandatoryParameter.CALCULATION:
        return <CalculationParameter form={form} isReadOnly={isReadOnly} />;
      case MandatoryParameter.RESOURCE:
        return <ResourceParameter form={form} isReadOnly={isReadOnly} />;
      case MandatoryParameter.SHOULD_BE:
        return <ParameterParameter form={form} isReadOnly={isReadOnly} />;
      case NonMandatoryParameter.INSTRUCTION:
        return <TextInstruction form={form} isReadOnly={isReadOnly} />;
      case NonMandatoryParameter.MATERIAL:
        return <MaterialInstruction form={form} isReadOnly={isReadOnly} />;
      default:
        return null;
    }
  };

  const filtersSection = () => {
    return <div key="filters-section">{renderFiltersByType()}</div>;
  };

  const renderFiltersByType = () => {
    switch (type) {
      case MandatoryParameter.RESOURCE:
        return <ResourceFilter form={form} isReadOnly={isReadOnly} />;
      default:
        return null;
    }
  };

  const validationsSection = () => {
    return <div key="validations-section">{renderValidationsByType()}</div>;
  };

  const renderValidationsByType = () => {
    switch (type) {
      case MandatoryParameter.RESOURCE:
        return <ResourceValidation form={form} isReadOnly={isReadOnly} />;
      case MandatoryParameter.NUMBER:
        return <NumberValidation form={form} isReadOnly={isReadOnly} />;
      default:
        return null;
    }
  };

  const locationSection = () => {
    return (
      <div key="location-section">
        {currentParameter?.targetEntityType
          ? TargetEntityTypeVisual[currentParameter.targetEntityType]
          : ''}
      </div>
    );
  };

  const sections =
    type in NonMandatoryParameter
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
          ...(addParameter?.parameterId
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
    setParameterOptions(
      Object.entries(ParameterTypeMap).reduce<{ label: string | JSX.Element; value: string }[]>(
        (acc, [value, label]) => {
          if (!(value in NonMandatoryParameter) && value !== MandatoryParameter.CHECKLIST) {
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

    if (addParameter?.parameterId) {
      fetchParameter();
    } else if (addParameter?.type) {
      reset({
        ...defaultValues,
        type: addParameter.type,
        ...(addParameter.type in NonMandatoryParameter && { mandatory: false }),
      });
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
      if (addParameter.parameterId && currentParameter) {
        dispatch(
          updateParameterApi({
            ...currentParameter,
            ...(currentParameter.type !== _data.type && {
              ...generateNewParameter({ ...currentParameter, type: _data.type }),
            }),
            ..._data,
          }),
        );
      } else {
        let orderTree = 1;
        const generatedParameter = generateNewParameter({ orderTree, ..._data });
        if (addParameter.action === 'task' && activeTaskId && activeStageId) {
          const parametersInTask = parameterOrderInTaskInStage?.[activeStageId]?.[activeTaskId];
          const maxOrderTree =
            listById?.[parametersInTask?.[parametersInTask?.length - 1]]?.orderTree ?? 0;
          orderTree = maxOrderTree + 1;
          dispatch(resetTaskParameterError(activeTaskId));
          dispatch(
            addNewParameter({
              ...generatedParameter,
              orderTree,
              checklistId: (data as Checklist).id,
              taskId: activeTaskId,
              stageId: activeStageId,
              ..._data,
            }),
          );
        } else {
          dispatch(
            addNewParameter({
              ...generatedParameter,
              checklistId: (data as Checklist).id,
              orderTree,
              ..._data,
            }),
          );
        }
      }
    }
  };

  const fetchParameter = async () => {
    try {
      const response = await request('GET', apiSingleParameter(addParameter!.parameterId!));
      if (response.data) {
        setCurrentParameter(response.data);
        reset({
          mandatory: response.data.mandatory,
          label: response.data.label,
          description: response.data.description,
          type: response.data.type,
          data: response.data.data,
          validations: response.data.validations,
          autoInitialize: response.data?.autoInitialize,
          autoInitialized: response.data?.autoInitialized,
        });
      }
    } catch (e) {
      console.error('Error Fetching Parameter', e);
    }
  };

  const onDelete = async () => {
    const { data } = await request('PATCH', apiDeleteParameter(addParameter!.parameterId!));
    if (data) {
      if (data?.taskId && data?.stageId) {
        dispatch(
          deleteParameterSuccess({
            taskId: data.taskId,
            stageId: data.stageId,
            parameterId: addParameter!.parameterId!,
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
                disabled: isReadOnly,
                ref: register({
                  required: true,
                }),
              },
            },
          ]}
        />
        {!(type in NonMandatoryParameter) && (
          <>
            {addParameter?.parameterId ? (
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
          return activeStep === parseInt(section.value) ? section.renderFn() : null;
        })}
      </AddParameterWrapper>
    ),
    footerContent: (
      <>
        {!isReadOnly && !addParameter?.parameterId && activeStep !== 0 && (
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        )}
        {!isReadOnly && addParameter?.parameterId && (
          <Button variant="textOnly" color="red" onClick={handleDeleteParameter}>
            <DeleteOutlined /> Delete Parameter
          </Button>
        )}
        <Button variant="secondary" style={{ marginLeft: 'auto' }} onClick={handleCloseDrawer}>
          {isReadOnly ? 'Close' : 'Cancel'}
        </Button>
        {!isReadOnly && (
          <>
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
