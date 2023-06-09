import { MandatoryParameter, ParameterType } from '#JobComposer/checklist.types';
import ResourceParameter from '#PrototypeComposer/Parameters/SetupViews/Resource';
import { Button, FormGroup, ToggleSwitch, useDrawer } from '#components';
import { useTypedSelector } from '#store';
import { InputTypes } from '#utils/globalTypes';
import { createJobSuccess } from '#views/Jobs/ListView/actions';
import { Step, StepIconProps, StepLabel, Stepper } from '@material-ui/core';
import {
  CheckCircleOutline,
  DateRangeOutlined,
  DoneAllOutlined,
  EventNoteOutlined,
  Filter1Outlined,
  RadioButtonChecked,
  RadioButtonUnchecked,
  ShortTextOutlined,
  SubjectOutlined,
} from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RenderParameterLabel } from './index';
import { createObjectTypeProperty, editObjectTypeProperty } from '#views/Ontology/actions';
import ChecklistParameter from './Options';
import { PropertyFlags } from '#views/Ontology/utils';

type Props = {
  showBasic: number;
};
const AddPropertyDrawerWrapper = styled.form.attrs({})<Pick<Props, 'showBasic'>>`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  .form-group {
    padding: 0;
    margin-bottom: 16px;
    :last-of-type {
      margin-bottom: 0;
    }
  }

  .form-basic-info-section {
    display: ${({ showBasic }) => (showBasic === 0 ? 'unset' : 'none')};
  }
  .form-setup-section {
    display: ${({ showBasic }) => (showBasic !== 0 ? 'unset' : 'none')};
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

const AddPropertyDrawer: FC<{
  onCloseDrawer: React.Dispatch<React.SetStateAction<boolean | string>>;
  label: string | boolean;
  property: any;
}> = ({ onCloseDrawer, label, property }) => {
  const dispatch = useDispatch();
  const {
    prototypeComposer: {
      parameters: {
        parameters: { list: parametersList },
      },
    },
  } = useTypedSelector((state) => state);
  const [activeStep, setActiveStep] = useState(0);

  const {
    objectTypes: { active },
  } = useTypedSelector((state) => state.ontology);

  const [parameterOptions, setParameterOptions] = useState<
    { label: string | JSX.Element; value: string }[]
  >([]);

  const form = useForm<{
    mandatory: boolean;
    displayName: string;
    description: string;
    inputType: ParameterType;
    data: any;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: { mandatory: true },
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

  register('mandatory');
  register('inputType', {
    required: true,
  });

  const { mandatory, displayName, inputType } = watch(['mandatory', 'displayName', 'inputType']);

  const basicInformation = () => {
    return (
      <div
        style={{
          height: '100%',
        }}
        key="basic-info-section"
        className="form-basic-info-section"
      >
        <FormGroup
          style={{ marginBottom: 24 }}
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'type',
                label: 'Object Type',
                isDisabled: true,
                isSearchable: false,
                placeholder: 'Select Object Type',
                value: active?.id ? { label: active.displayName, value: active.id } : null,
              },
            },
            {
              type: InputTypes.SINGLE_LINE,
              props: {
                id: 'id',
                label: 'ID',
                disabled: true,
                isSearchable: false,
                placeholder: 'Auto Generated',
              },
            },
            {
              type: InputTypes.MULTI_LINE,
              props: {
                id: 'description',
                label: 'Description',
                name: 'description',
                optional: true,
                isSearchable: false,
                placeholder: 'Write Here',
                rows: 3,
                ref: register,
              },
            },
          ]}
        />
      </div>
    );
  };

  const setupSection = () => {
    return (
      <div
        style={{
          height: '100%',
        }}
        className="form-setup-section"
        key="setup-section"
      >
        <FormGroup
          style={{ marginBottom: 24 }}
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'inputType',
                label: 'Property Type',
                options: parameterOptions,
                isSearchable: false,
                placeholder: 'Select Parameter Type',
                isDisabled: label === 'Edit',
                defaultValue: inputType
                  ? [{ label: ParameterTypeMap[inputType], value: inputType }]
                  : null,
                onChange: (option: { value: string }) => {
                  setValue(
                    'inputType',
                    option.value === MandatoryParameter.MULTISELECT ? 'MULTI_SELECT' : option.value,
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                },
              },
            },
          ]}
        />
        {property?.flags !== 21 && (
          <ToggleSwitch
            height={24}
            width={48}
            offLabel="Optional"
            onColor="#24a148"
            value={mandatory}
            onChange={(isChecked) => {
              setValue('mandatory', isChecked, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            onLabel="Required"
          />
        )}
        {renderSetupViewsByType()}
      </div>
    );
  };

  const renderSetupViewsByType = () => {
    switch (inputType) {
      case MandatoryParameter.SINGLE_SELECT:
      case 'MULTI_SELECT':
        return <ChecklistParameter form={form} />;

      default:
        return null;
    }
  };

  const sections = [
    {
      label: 'Basic Information',
      value: '0',
      panelContent: <div />,
      renderFn: basicInformation,
    },
    {
      label: 'Setup',
      value: '1',
      panelContent: <div />,
      renderFn: setupSection,
    },
  ];

  useEffect(() => {
    setDrawerOpen(true);
  }, [onCloseDrawer]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      onCloseDrawer(false);
    }, 200);
  };

  const flagHandler = (flags: number) => {
    switch (flags) {
      case PropertyFlags.DISPLAY_NAME:
        return property.flags;
      case PropertyFlags.MANDATORY:
      case PropertyFlags.OPTIONAL:
        return mandatory ? PropertyFlags.MANDATORY : PropertyFlags.OPTIONAL;
      default:
        return PropertyFlags.MANDATORY;
    }
  };

  const findHighestSortOrder = (arr: any) => {
    let highestSortOrder = 0;
    if (arr?.length > 0) {
      arr.forEach((currentObject: any) => {
        if (currentObject.sortOrder > highestSortOrder) {
          highestSortOrder = currentObject.sortOrder;
        }
      });
    }
    return highestSortOrder;
  };

  const onSubmit = () => {
    const _data = getValues();

    if (label === 'Edit') {
      const newData = {
        id: property?.id,
        displayName,
        inputType,
        description: _data?.description || '',
        flags: flagHandler(property?.flags),
        options: _data?.data?.map((currData) => {
          if (property?.options?.some((currOption) => currOption?.id === currData?.id)) {
            return currData;
          } else {
            return { displayName: currData?.displayName };
          }
        }),
      };

      dispatch(
        editObjectTypeProperty({
          objectTypeId: active?.id,
          data: newData,
          propertyId: property?.id,
        }),
      );
    } else {
      let maxSortOrder = findHighestSortOrder(active?.properties || []);
      const newData = {
        id: null,
        displayName,
        inputType,
        description: _data?.description || '',
        sortOrder: maxSortOrder + 1,
        flags: mandatory ? PropertyFlags.MANDATORY : PropertyFlags.OPTIONAL,
        options:
          _data?.data?.map((currData: any) => ({ displayName: currData?.displayName })) || [],
      };

      dispatch(createObjectTypeProperty({ objectTypeId: active?.id, data: newData }));
    }
    handleCloseDrawer();
  };

  useEffect(() => {
    setParameterOptions(
      Object.entries(ParameterTypeMap).reduce<{ label: string | JSX.Element; value: string }[]>(
        (acc, [value, label]) => {
          acc.push({
            label,
            value,
          });
          return acc;
        },
        [],
      ),
    );
  }, []);

  useEffect(() => {
    if (property?.id) {
      reset({
        displayName: property.displayName,
        description: property.description,
        inputType: property.inputType,
        data: property.options,
        mandatory: property?.flags === PropertyFlags.MANDATORY,
      });
    }
  }, []);
  const { StyledDrawer, setDrawerOpen } = useDrawer({
    title: label === 'Edit' ? 'Edit Property' : 'Create a New Property',
    hideCloseIcon: true,
    bodyContent: (
      <AddPropertyDrawerWrapper onSubmit={handleSubmit(onSubmit)} showBasic={activeStep}>
        <FormGroup
          style={{ marginBlock: 24 }}
          inputs={[
            {
              type: InputTypes.SINGLE_LINE,
              props: {
                placeholder: 'Write here',
                label: 'Label',
                id: 'displayName',
                name: 'displayName',
                ref: register({
                  required: true,
                }),
              },
            },
          ]}
        />
        <StepperWrapper activeStep={activeStep} alternativeLabel connector={<div />}>
          {sections.map((step, index) => (
            <StepWrapper key={step.label} active={index <= activeStep}>
              <StepLabel StepIconComponent={CustomStepIcon}>{step.label}</StepLabel>
            </StepWrapper>
          ))}
        </StepperWrapper>
        {sections.map((section) => {
          return section.renderFn();
          // return activeStep === parseInt(section.value) ? section.renderFn() : null;
        })}
      </AddPropertyDrawerWrapper>
    ),
    footerContent: (
      <>
        <Button variant="secondary" style={{ marginLeft: 'auto' }} onClick={handleCloseDrawer}>
          Cancel
        </Button>
        {activeStep === sections.length - 1 ? (
          <Button type="submit" disabled={!isDirty || !isValid} onClick={onSubmit}>
            {label === 'Edit' ? 'Update' : 'Create'}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={activeStep === 0 ? !displayName : !isValid}>
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

  return <AddPropertyDrawerWrapper>{StyledDrawer}</AddPropertyDrawerWrapper>;
};

const ParameterIconByType = {
  [MandatoryParameter.MULTISELECT]: <DoneAllOutlined />,
  [MandatoryParameter.SINGLE_SELECT]: <DoneAllOutlined />,
  [MandatoryParameter.SINGLE_LINE]: <ShortTextOutlined />,
  [MandatoryParameter.MULTI_LINE]: <SubjectOutlined />,
  [MandatoryParameter.NUMBER]: <Filter1Outlined />,
  [MandatoryParameter.DATE]: <DateRangeOutlined />,
  [MandatoryParameter.DATE_TIME]: <EventNoteOutlined />,
};

const ParameterTypeMap: Record<string, JSX.Element | string> = {
  ['MULTI_SELECT']: (
    <RenderParameterLabel
      label="Multi-select dropdown"
      icon={ParameterIconByType[MandatoryParameter.MULTISELECT]}
    />
  ),

  [MandatoryParameter.SINGLE_SELECT]: (
    <RenderParameterLabel
      label="Single-select dropdown"
      icon={ParameterIconByType[MandatoryParameter.SINGLE_SELECT]}
    />
  ),
  [MandatoryParameter.SINGLE_LINE]: (
    <RenderParameterLabel
      label="Single-line text"
      icon={ParameterIconByType[MandatoryParameter.SINGLE_LINE]}
    />
  ),
  [MandatoryParameter.MULTI_LINE]: (
    <RenderParameterLabel
      label="Multi-line text"
      icon={ParameterIconByType[MandatoryParameter.MULTI_LINE]}
    />
  ),

  [MandatoryParameter.NUMBER]: (
    <RenderParameterLabel label="Number" icon={ParameterIconByType[MandatoryParameter.NUMBER]} />
  ),
  [MandatoryParameter.DATE]: (
    <RenderParameterLabel label="Date" icon={ParameterIconByType[MandatoryParameter.DATE]} />
  ),
  [MandatoryParameter.DATE_TIME]: (
    <RenderParameterLabel
      label="Date-Time"
      icon={ParameterIconByType[MandatoryParameter.DATE_TIME]}
    />
  ),
};

export default AddPropertyDrawer;
