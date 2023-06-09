import { Button, Checkbox, FormGroup } from '#components';
import { InputTypes } from '#utils/globalTypes';

import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ShortTextOutlined } from '@material-ui/icons';
import { MandatoryParameter, NonMandatoryParameter } from '#JobComposer/checklist.types';
import { useForm } from 'react-hook-form';
import { createObjectType, editObjectType } from '#views/Ontology/actions';
import { navigate } from '@reach/router';
import { useTypedSelector } from '#store';

const AddObjectTypeWrapper = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
  gap: 20px;
  margin: 32px;
  // position: relative;
  .header {
    > div {
      font-size: 20px;
      font-weight: bold;
      margin-left: 4px;
    }
    padding: 16px 0px 16px 4px;
    font-size: 14px;
    font-weight: bold;
  }

  > div:nth-child(3) {
    margin-bottom: 32px;
  }

  .footer {
    display: flex;
    flex: 1;
    // width: 100%;
    padding: 16px 10px;
    background: #fff;
    border-top: 1px solid #f4f4f4;
    position: absolute;
    bottom: 0px;
    left: 48px;
    right: 0px;
    > div {
      display: flex;
      margin-left: 32px;
    }
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Wrapper = styled.div.attrs({
  className: 'basic-details-wrapper',
})`

  display: flex;
  justify-content: center;
  flex-direction: column;
  // border: 1px solid;
  background:#fff;

  .header {
    border-bottom: 1px solid #e0e0e0;
    padding-inline:20px;
  }

  .sub-header {
    margin: 20px 20px 20px 24px;
    font-size:12px;
  }

  .property-section {
    display:flex;
    gap:12px;
    border-top: 1px solid #e0e0e0;
    margin-inline:8px;
    padding-block:8px;
    flex-direction:column;

    .property-section-header{
      font-size:14px;
      font-weight: bold;
    }
    .property-section-sub-header{
      font-size:12px;
    }

    
    >div:last-child{
      font-size:12px;
      padding:0px 16px 8px 16px;

      >span{
        color:#da1e28;
      }

    }

 
      &-icon, &-header, &-sub-header{
        margin-left:16px;
      }
 
    }
  }


`;

const ParameterLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  color: #525252;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.32px;

  .parameter-icon {
    background-color: #4589ff;
    border-radius: 50%;
    margin-right: 8px;
    display: flex;
    padding: 4px;
    svg {
      color: #fff;
      height: 16px;
      width: 16px;
      margin: unset;
      &:hover {
        color: #fff;
      }
    }
  }
`;

export const RenderParameterLabel: React.FC<{ label: string; icon: JSX.Element }> = ({
  label,
  icon,
}) => {
  return (
    <ParameterLabelWrapper>
      <div className="parameter-icon">{icon}</div>
      {label}
    </ParameterLabelWrapper>
  );
};
const AddObjectType: FC<{ path: string; id?: string }> = ({ path, id: editObjectTypeId }) => {
  const dispatch = useDispatch();

  const {
    objectTypes: { list },
  } = useTypedSelector((state) => state.ontology);

  const form = useForm<{
    label: string;
    description: string;
    pluralName: string;
    properties: any;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: { properties: [] },
  });

  const {
    setValue,
    watch,
    register,
    formState: { isDirty, isValid },
    handleSubmit,
    reset,
  } = form;

  register(`properties`, {
    validate: (value, formValues) =>
      value.length >= 2 &&
      value.every((currValue) => {
        return currValue.hasOwnProperty('displayName');
      }),
  });

  const { label, pluralName, properties, description } = watch([
    'label',
    'pluralName',
    'properties',
    'description',
  ]);

  const basicDetails = () => {
    return (
      <Wrapper>
        <div className="header">Basic Details</div>
        <div>
          <FormGroup
            style={{ paddingInline: '24px' }}
            inputs={[
              {
                type: InputTypes.SINGLE_LINE,
                props: {
                  placeholder: 'Write here',
                  label: 'Display Name',
                  id: 'displayName',
                  name: 'displayName',
                  ref: register({
                    required: true,
                  }),
                },
              },
              {
                type: InputTypes.NUMBER,
                props: {
                  label: 'ID',
                  placeholder: 'Auto Generated',
                  disabled: true,
                },
              },
              {
                type: InputTypes.SINGLE_LINE,
                props: {
                  placeholder: 'Write here',
                  label: 'Plural Name',
                  id: 'pluralName',
                  name: 'pluralName',
                  disabled: editObjectTypeId ? true : false,
                  ref: register({
                    required: true,
                  }),
                },
              },
              {
                type: InputTypes.MULTI_LINE,
                props: {
                  placeholder: 'Write here',
                  label: 'Description',
                  id: 'description',
                  name: 'description',
                  optional: true,
                  ref: register,
                  rows: 3,
                },
              },
            ]}
          />
        </div>
      </Wrapper>
    );
  };

  const propertiesDetails = () => {
    return (
      <Wrapper>
        <div className="header">Title and Identifier Properties</div>
        <div className="sub-header">
          To Create the Object Type, Its title and Identifier properties need to be defined. An
          object type can't exist in Leucine without these.
        </div>

        {[
          {
            label: 'Title Property',
            description: 'This will be display name for each Object created for this Object type.',
          },
          {
            label: 'Identifier Property',
            description: 'This Property will be unique for each object of this unique Object type.',
          },
        ].map((currProperty, index) => {
          return (
            <div className="property-section" key={index}>
              <div className="property-section-header">{currProperty?.label}</div>
              <div className="property-section-sub-header">{currProperty?.description}</div>
              <FormGroup
                style={{ padding: '16px' }}
                inputs={[
                  {
                    type: InputTypes.SINGLE_LINE,
                    props: {
                      placeholder: 'Write here',
                      label: 'Display Name',
                      id: 'label',
                      name: 'label',
                      disabled: editObjectTypeId ? true : false,
                      defaultValue: editObjectTypeId ? properties[index]?.displayName : null,
                      onChange: (value: any) => {
                        let _properties = [...properties];
                        _properties[index] = {
                          displayName: value.value,
                          externalId: index === 0 ? 'displayName' : 'externalId',
                          sortOrder: index === 0 ? 2 : 1,
                          flags: index === 0 ? 21 : 27,
                          id: null,
                          options: [],
                          inputType: InputTypes.SINGLE_LINE,
                        };

                        setValue(`properties`, _properties, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      },
                    },
                  },
                  {
                    type: InputTypes.NUMBER,
                    props: {
                      label: 'ID',
                      placeholder: 'Auto Generated',
                      disabled: true,
                    },
                  },
                  {
                    type: InputTypes.MULTI_LINE,
                    props: {
                      placeholder: 'Write here',
                      label: 'Description',
                      id: 'description',
                      name: 'description',
                      optional: true,
                      rows: 3,
                      disabled: editObjectTypeId ? true : false,
                      defaultValue: editObjectTypeId ? properties[index]?.description : null,
                      onChange: (value: any) => {
                        let _properties = [...properties];
                        _properties[index] = { ...properties[index], description: value.value };

                        setValue(`properties`, _properties, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      },
                    },
                  },
                ]}
              />
              <div>
                <span>*</span>Property is mandatory
              </div>
            </div>
          );
        })}
      </Wrapper>
    );
  };

  const activeObjectType = list.filter((curr) => curr.id === editObjectTypeId)?.[0];

  const onSubmit = (data: any) => {
    if (editObjectTypeId) {
      const _data = {
        displayName: data?.displayName,
        description: data?.description,
        pluralName: data?.pluralName,
      };
      dispatch(editObjectType({ objectTypeId: activeObjectType.id, data: _data, navigate }));
    } else {
      const _data = {
        ...data,
        collection: 'objectTypes',
        id: null,
        usageStatus: 1,
        version: 1,
        relations: [],
        statuses: [],
      };
      dispatch(createObjectType({ data: _data, navigate }));
    }
  };

  useEffect(() => {
    if (editObjectTypeId) {
      reset({
        displayName: activeObjectType?.displayName,
        pluralName: activeObjectType?.pluralName,
        description: activeObjectType?.description,
        properties: activeObjectType?.properties,
      });
    }
  }, []);

  return (
    <AddObjectTypeWrapper onSubmit={handleSubmit(onSubmit)}>
      <div className="header">
        <div>{editObjectTypeId ? 'Edit Object Type' : 'Add New Object Type'}</div>
      </div>
      {basicDetails()}
      {propertiesDetails()}
      <div className="footer">
        <div>
          <Button type="submit" disabled={!isValid || !isDirty}>
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </AddObjectTypeWrapper>
  );
};

export default AddObjectType;
