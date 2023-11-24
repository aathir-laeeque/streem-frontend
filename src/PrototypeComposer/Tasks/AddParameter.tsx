import {
  addNewParameter,
  deleteParameterSuccess,
  toggleNewParameter,
  updateParameterApi,
} from '#PrototypeComposer/Activity/actions';
import { generateNewParameter } from '#PrototypeComposer/Activity/utils';
import ResourceFilter from '#PrototypeComposer/Parameters/FilterViews/Resource';
import CalculationParameter from '#PrototypeComposer/Parameters/SetupViews/Calculation';
import ChecklistParameter from '#PrototypeComposer/Parameters/SetupViews/Checklist';
import LinkParameter from '#PrototypeComposer/Parameters/SetupViews/LinkParameter';
import MaterialInstruction from '#PrototypeComposer/Parameters/SetupViews/MaterialInstruction';
import ParameterParameter from '#PrototypeComposer/Parameters/SetupViews/Parameter';
import ResourceParameter from '#PrototypeComposer/Parameters/SetupViews/Resource';
import TextInstruction from '#PrototypeComposer/Parameters/SetupViews/TextInstruction';
import YesNoParameter from '#PrototypeComposer/Parameters/SetupViews/YesNo';
import NumberValidation from '#PrototypeComposer/Parameters/ValidationViews/Number';
import ResourceValidation from '#PrototypeComposer/Parameters/ValidationViews/Resource';
import LeastCount from '#PrototypeComposer/Parameters/SetupViews/LeastCount';
import {
  Checklist,
  MandatoryParameter,
  NonMandatoryParameter,
  Parameter,
  ParameterVerificationTypeEnum,
  TargetEntityType,
} from '#PrototypeComposer/checklist.types';
import { ParameterTypeMap, TargetEntityTypeVisual } from '#PrototypeComposer/constants';
import { ComposerEntity } from '#PrototypeComposer/types';
import {
  Button,
  Checkbox,
  FormGroup,
  StepperContainer,
  StyledTabs,
  ToggleSwitch,
  useDrawer,
} from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { apiDeleteParameter, apiSingleParameter } from '#utils/apiUrls';
import { InputTypes } from '#utils/globalTypes';
import { getErrorMsg, request } from '#utils/request';
import { resetOntology } from '#views/Ontology/actions';
import { Divider } from '@material-ui/core';
import { DeleteOutlined } from '@material-ui/icons';
import { cloneDeep } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { resetTaskParameterError } from './actions';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { ParameterMode, ParameterType } from '#types';

const CustomTooltip = withStyles({
  tooltip: {
    width: '205px',
    backgroundColor: '#393939',
    borderRadius: '0px',
    color: '#fff',
    textAlign: 'center',
    fontSize: '14px',
  },
  arrow: {
    color: '#393939',
  },
})(Tooltip);

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

const ParameterVerificationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 24px;
  color: #161616;

  .parameter-verification {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 180px;
  }

  h4 {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.14;
    letter-spacing: 0.16px;
    margin: 0px;
  }

  span {
    color: #c2c2c2;
  }

  .checkmark {
    background-color: #fff;
    border-color: #333;
    border-radius: 0;
    border-width: 2px;
  }

  input:checked ~ .checkmark {
    background-color: #1d84ff;
    border: none;
  }
`;

const isFiltersAllowed = (type: ParameterType) => {
  switch (type) {
    case MandatoryParameter.MULTI_RESOURCE:
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
  verificationType: ParameterVerificationTypeEnum.NONE,
};

const AddParameter: FC<{ isReadOnly: boolean; id?: string; entity: ComposerEntity }> = ({
  isReadOnly,
}) => {
  const dispatch = useDispatch();
  const {
    data,
    parameters: { parameterOrderInTaskInStage, listById, addParameter },
    stages: { activeStageId },
  } = useTypedSelector((state) => state.prototypeComposer);
  const [activeStep, setActiveStep] = useState(0);
  const [currentParameter, setCurrentParameter] = useState<Parameter>();
  const [parameterOptions, setParameterOptions] = useState<
    { label: string | JSX.Element; value: string }[]
  >([]);
  const form = useForm<{
    mandatory: boolean;
    label: string;
    mode: string;
    description: string;
    type: ParameterType;
    data: any;
    validations: Record<string, any>;
    autoInitialize: Record<string, any>;
    autoInitialized?: boolean;
    verificationType: string;
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
    reset,
  } = form;

  register('mode');
  register('mandatory');
  register('data', {
    required: true,
  });
  register('type', {
    required: true,
  });
  register('verificationType');
  register('autoInitialized');

  const { mandatory, label, type, mode, verificationType, autoInitialized } = watch([
    'mandatory',
    'label',
    'type',
    'mode',
    'verificationType',
    'autoInitialized',
  ]);

  const isLabelReadOnly = isReadOnly;
  isReadOnly = mode === ParameterMode.READ_ONLY ? true : isReadOnly;
  const showFiltersSection = isFiltersAllowed(type);
  const showValidationsSection = isValidationsAllowed(type);
  const [formDescription, setFormDescription] = useState<string>('');

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
              defaultValue: formDescription,
              ref: register,
              onChange: (value: Record<string, string>) => {
                setFormDescription(value?.value);
              },
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
                  onChange: async (option: { value: ParameterType }) => {
                    reset({
                      ...defaultValues,
                      data: undefined,
                      label: label,
                      mandatory: mandatory,
                      autoInitialize: undefined,
                      autoInitialized: false,
                      type: option.value,
                    });
                  },
                },
              },
            ]}
          />
        )}
        {[MandatoryParameter.SHOULD_BE, MandatoryParameter.NUMBER].includes(type) && (
          <LeastCount form={form} isReadOnly={isReadOnly} />
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
            checked={mandatory}
            disabled={isReadOnly}
          />
        )}
        {!(type in NonMandatoryParameter) && (
          <ParameterVerificationWrapper>
            <Divider />
            <h4>
              Parameter Verification <span>(Optional)</span>
            </h4>
            <CustomTooltip
              title={
                currentParameter?.targetEntityType === TargetEntityType.PROCESS
                  ? 'Verification are not applicable for Parameters in the Create Job Form'
                  : ''
              }
              arrow
              placement="right"
            >
              <div className="parameter-verification">
                {type !== MandatoryParameter.CALCULATION && !autoInitialized && (
                  <Checkbox
                    onClick={(e) => {
                      const { checked } = e.target;
                      setValue(
                        'verificationType',
                        verificationType === ParameterVerificationTypeEnum.PEER
                          ? ParameterVerificationTypeEnum.BOTH
                          : verificationType === ParameterVerificationTypeEnum.BOTH
                          ? ParameterVerificationTypeEnum.PEER
                          : checked
                          ? ParameterVerificationTypeEnum.SELF
                          : ParameterVerificationTypeEnum.NONE,
                        {
                          shouldValidate: true,
                        },
                      );
                    }}
                    checked={
                      verificationType === ParameterVerificationTypeEnum.SELF ||
                      verificationType === ParameterVerificationTypeEnum.BOTH
                    }
                    label="Self Verification"
                    disabled={
                      isReadOnly || currentParameter?.targetEntityType === TargetEntityType.PROCESS
                    }
                  />
                )}
                <Checkbox
                  onClick={(e) => {
                    const { checked } = e.target;
                    setValue(
                      'verificationType',
                      verificationType === ParameterVerificationTypeEnum.SELF
                        ? ParameterVerificationTypeEnum.BOTH
                        : verificationType === ParameterVerificationTypeEnum.BOTH
                        ? ParameterVerificationTypeEnum.SELF
                        : checked
                        ? ParameterVerificationTypeEnum.PEER
                        : ParameterVerificationTypeEnum.NONE,
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                  checked={
                    verificationType === ParameterVerificationTypeEnum.PEER ||
                    verificationType === ParameterVerificationTypeEnum.BOTH
                  }
                  label="Peer Verification"
                  disabled={
                    isReadOnly || currentParameter?.targetEntityType === TargetEntityType.PROCESS
                  }
                />
              </div>
            </CustomTooltip>
          </ParameterVerificationWrapper>
        )}
        {renderSetupViewsByType()}
        {[
          MandatoryParameter.NUMBER,
          MandatoryParameter.SINGLE_LINE,
          MandatoryParameter.DATE,
          MandatoryParameter.DATE_TIME,
          MandatoryParameter.MULTI_LINE,
          MandatoryParameter.RESOURCE,
        ].includes(type) && <LinkParameter form={form} type={type} isReadOnly={isReadOnly} />}
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
      case MandatoryParameter.MULTI_RESOURCE:
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
      case MandatoryParameter.MULTI_RESOURCE:
        return <ResourceFilter form={form} isReadOnly={isReadOnly} parameter={currentParameter} />;
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
      case MandatoryParameter.MULTI_RESOURCE:
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
    return () => {
      dispatch(resetOntology(['objectTypes']));
      if (addParameter?.parameterId) {
        setCurrentParameter(undefined);
      }
      setFormDescription('');
    };
  }, [addParameter]);

  useEffect(() => {
    const _setValue = (value: any) => {
      setValue('data', value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };
    const dataExists = !!getValues()?.data;
    if (!dataExists) {
      if (
        [
          MandatoryParameter.DATE,
          MandatoryParameter.DATE_TIME,
          MandatoryParameter.MEDIA,
          MandatoryParameter.MULTI_LINE,
          MandatoryParameter.NUMBER,
          MandatoryParameter.SIGNATURE,
          MandatoryParameter.SINGLE_LINE,
          MandatoryParameter.FILE_UPLOAD,
        ].includes(type)
      ) {
        _setValue({});
      }
    }
  }, [type]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      reset({ ...getValues(), description: formDescription });
    }
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
    setFormDescription('');
  };

  const onSubmit = () => {
    if (addParameter) {
      const _data = getValues();
      const compactFilters = _data?.data?.propertyFilters?.fields?.filter((field) => !!field);
      if (addParameter.parameterId && currentParameter) {
        dispatch(
          updateParameterApi({
            ...currentParameter,
            ..._data,
            ...(formDescription?.length > 0 && { description: formDescription }),
            ...((compactFilters?.length > 0 || _data?.data?.propertyValidations) && {
              data: {
                ..._data.data,
                ...(compactFilters?.length > 0 && {
                  propertyFilters: {
                    ..._data?.data?.propertyFilters,
                    fields: compactFilters,
                  },
                }),
                ...(_data?.data?.propertyValidations && {
                  propertyValidations: (_data?.data?.propertyValidations || []).filter(
                    (field) => !!field,
                  ),
                }),
              },
            }),
          }),
        );
      } else {
        let orderTree = 1;
        if ('data' in _data && !_data.data) delete _data.data;
        const generatedParameter = generateNewParameter({ orderTree, ..._data });
        if (addParameter.action === 'task' && addParameter.taskId && activeStageId) {
          const parametersInTask =
            parameterOrderInTaskInStage?.[activeStageId]?.[addParameter.taskId];
          const maxOrderTree =
            listById?.[parametersInTask?.[parametersInTask?.length - 1]]?.orderTree ?? 0;
          orderTree = maxOrderTree + 1;
          dispatch(resetTaskParameterError(addParameter.taskId));
          dispatch(
            addNewParameter({
              ...generatedParameter,
              orderTree,
              checklistId: (data as Checklist).id,
              taskId: addParameter.taskId,
              stageId: activeStageId,
              ..._data,
              ...(formDescription?.length > 0 && { description: formDescription }),
              ...(compactFilters?.length > 0 && {
                data: {
                  ..._data.data,
                  propertyFilters: {
                    ..._data?.data?.propertyFilters,
                    fields: compactFilters,
                  },
                },
              }),
              ...(_data?.data?.propertyValidations && {
                data: {
                  ..._data.data,
                  propertyValidations: (_data?.data?.propertyValidations || []).filter(
                    (field) => !!field,
                  ),
                },
              }),
            }),
          );
        } else {
          dispatch(
            addNewParameter({
              ...generatedParameter,
              checklistId: (data as Checklist).id,
              orderTree,
              ..._data,
              ...(formDescription?.length > 0 && { description: formDescription }),
              ...(compactFilters?.length > 0 && {
                data: {
                  ..._data.data,
                  propertyFilters: {
                    ..._data?.data?.propertyFilters,
                    fields: compactFilters,
                  },
                },
              }),
              ...(_data?.data?.propertyValidations && {
                data: {
                  ..._data.data,
                  propertyValidations: (_data?.data?.propertyValidations || []).filter(
                    (field) => !!field,
                  ),
                },
              }),
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
        reset({
          mandatory: response.data.mandatory,
          label: response.data.label,
          mode: response.data.mode,
          description: response.data.description,
          type: response.data.type,
          data: response.data.data,
          validations: response.data.validations,
          autoInitialize: response.data?.autoInitialize,
          autoInitialized: response.data?.autoInitialized,
          verificationType: response.data?.verificationType,
        });
        setFormDescription(response.data.description);
        setCurrentParameter(cloneDeep(response.data));
      }
    } catch (e) {
      console.error('Error Fetching Parameter', e);
    }
  };

  const onDelete = async () => {
    try {
      const { data, errors } = await request(
        'PATCH',
        apiDeleteParameter(addParameter!.parameterId!),
      );
      if (data) {
        dispatch(
          deleteParameterSuccess({
            taskId: data.taskId,
            stageId: data.stageId,
            parameterId: addParameter!.parameterId!,
            targetEntityType: currentParameter?.targetEntityType,
          }),
        );
      } else if (errors) {
        throw getErrorMsg(errors);
      }
      addParameter?.fetchData && addParameter.fetchData();
      handleCloseDrawer();
    } catch (error) {
      console.error('Error Deleting Parameter', error);
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
        }),
      );
    }
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
                disabled: isLabelReadOnly,
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
              <StepperContainer activeStep={activeStep} sections={sections} />
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
        {!isLabelReadOnly && !addParameter?.parameterId && activeStep !== 0 && (
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
          {isLabelReadOnly ? 'Close' : 'Cancel'}
        </Button>
        {!isLabelReadOnly && (
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
