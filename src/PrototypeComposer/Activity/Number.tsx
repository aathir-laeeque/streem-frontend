import { formatOptionLabel, FormGroup } from '#components';
import { useTypedSelector } from '#store';
import { apiGetObjectTypes, apiGetResourceActivitiesByType } from '#utils/apiUrls';
import { InputTypes } from '#utils/globalTypes';
import { request } from '#utils/request';
import { ObjectType } from '#views/Ontology/types';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateActivityApi, updateStoreActivity } from './actions';
import ActivityLabelInput from './ActivityLabelInput';
import { labelByConstraint } from './Resource';
import { ActivityProps } from './types';

const NumberWrapper = styled.div.attrs({
  className: 'activity-number',
})`
  label {
    color: #000000;
    display: block;
    font-size: 12px;
  }

  .textbox {
    margin-top: 12px;
    align-items: center;
    background-color: #fafafa;
    border-radius: 4px;
    color: #999999;
    cursor: not-allowed;
    display: flex;
    justify-content: center;
    padding: 90px;
  }

  .form-group {
    padding: 8px 0px;
  }

  .form-group-row {
    flex-direction: row;
    gap: 16px;

    > div {
      margin: 0;
      flex: 1;
    }
  }

  .custom-select__menu {
    z-index: 2;
  }

  h3 {
    margin-block: 12px;
  }
`;

const NumberActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();
  const { data } = useTypedSelector((state) => state.prototypeComposer);
  const componentLoaded = useRef<boolean>(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [resourceActivities, setResourceActivities] = useState<any>([]);
  const [selectedObjectType, setSelectedObjectType] = useState<ObjectType | undefined>(undefined);
  const [isLoadingObjectType, setIsLoadingObjectType] = useState(false);

  useEffect(() => {
    if (componentLoaded.current) {
      dispatch(updateActivityApi(activity));
    } else if (activity) {
      componentLoaded.current = true;
    }
  }, [activity]);

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (
      resourceActivities.length &&
      activity.validations.resourceActivityValidations?.[0]?.activityId
    ) {
      const selectedResourceActivity = resourceActivities.find(
        (resource: any) =>
          resource.id === activity.validations.resourceActivityValidations[0].activityId,
      );
      if (selectedResourceActivity) {
        fetchObjectType(selectedResourceActivity.data.objectTypeId);
      }
    }
  }, [resourceActivities]);

  const fetchActivities = async () => {
    if (!resourceActivities.length) {
      setIsLoadingActivities(true);
      const resources = await request('GET', apiGetResourceActivitiesByType(data!.id, 'RESOURCE'));
      setResourceActivities(resources.data);
      setIsLoadingActivities(false);
    }
  };

  const fetchObjectType = async (id: string) => {
    setSelectedObjectType(undefined);
    setIsLoadingObjectType(true);
    const res = await request('GET', apiGetObjectTypes(id));
    setSelectedObjectType(res.data);
    setIsLoadingObjectType(false);
  };

  return (
    <NumberWrapper>
      <label>Number Activity</label>
      <ActivityLabelInput activity={activity} />
      <div className="textbox" style={{ padding: 20 }}>
        Users will write their input here
      </div>
      <h3>Validation</h3>
      <FormGroup
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'objectType',
              formatOptionLabel,
              label: 'Resource Parameter',
              isLoading: isLoadingActivities,
              options: resourceActivities.map((resource: any) => ({
                ...resource.data,
                label: resource.label,
                value: resource.id,
              })),
              value: activity.validations.resourceActivityValidations?.[0]?.activityId
                ? [
                    {
                      label: resourceActivities.find(
                        (resource: any) =>
                          resource.id ===
                          activity.validations.resourceActivityValidations[0].activityId,
                      )?.label,
                      value: activity.validations.resourceActivityValidations[0].activityId,
                    },
                  ]
                : undefined,
              isSearchable: false,
              placeholder: 'Select Resource Parameter',
              onChange: (_option: any) => {
                dispatch(
                  updateStoreActivity(
                    [
                      {
                        ...activity.validations?.resourceActivityValidations?.[0],
                        activityId: _option.value,
                      },
                    ],
                    activity.id,
                    ['validations', 'resourceActivityValidations'],
                  ),
                );
                fetchObjectType(_option.objectTypeId);
              },
            },
          },
        ]}
      />
      {selectedObjectType && (
        <FormGroup
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'objectProperty',
                formatOptionLabel,
                label: 'Object Property',
                isLoading: isLoadingObjectType,
                options: selectedObjectType?.properties.reduce<Array<Record<string, string>>>(
                  (acc, objectTypeProperty) => {
                    if (objectTypeProperty.inputType === InputTypes.NUMBER) {
                      acc.push({
                        inputType: objectTypeProperty.inputType,
                        externalId: objectTypeProperty.externalId,
                        label: objectTypeProperty.displayName,
                        value: objectTypeProperty.id,
                      });
                    }
                    return acc;
                  },
                  [],
                ),
                value: activity.validations?.resourceActivityValidations?.[0]?.propertyId
                  ? [
                      {
                        label:
                          activity.validations.resourceActivityValidations[0].propertyDisplayName,
                        value: activity.validations.resourceActivityValidations[0].propertyId,
                      },
                    ]
                  : undefined,
                isSearchable: false,
                placeholder: 'Select Object Property',
                onChange: (_option: any) => {
                  dispatch(
                    updateStoreActivity(
                      [
                        {
                          ...activity.validations?.resourceActivityValidations?.[0],
                          propertyId: _option.value,
                          propertyInputType: _option.inputType,
                          propertyExternalId: _option.externalId,
                          propertyDisplayName: _option.label,
                        },
                      ],
                      activity.id,
                      ['validations', 'resourceActivityValidations'],
                    ),
                  );
                },
              },
            },
          ]}
        />
      )}
      {activity.validations?.resourceActivityValidations?.[0]?.propertyId && (
        <FormGroup
          inputs={[
            {
              type: InputTypes.SINGLE_SELECT,
              props: {
                id: 'objectPropertyCondition',
                label: 'Condition',
                options: Object.entries(
                  labelByConstraint(
                    activity.validations.resourceActivityValidations[0].propertyInputType,
                  ),
                ).map(([value, label]) => ({ label, value })),
                isSearchable: false,
                placeholder: 'Select Condition',
                value: activity.validations.resourceActivityValidations?.[0]?.constraint
                  ? [
                      {
                        label: (
                          labelByConstraint(
                            activity.validations.resourceActivityValidations[0].propertyInputType,
                          ) as any
                        )[activity.validations.resourceActivityValidations[0].constraint],
                        value: activity.validations.resourceActivityValidations[0].constraint,
                      },
                    ]
                  : undefined,
                onChange: (value: any) => {
                  dispatch(
                    updateStoreActivity(
                      [
                        {
                          ...activity.validations.resourceActivityValidations[0],
                          constraint: value.value,
                        },
                      ],
                      activity.id,
                      ['validations', 'resourceActivityValidations'],
                    ),
                  );
                },
              },
            },
            {
              type: InputTypes.SINGLE_LINE,
              props: {
                id: 'objectPropertyErrorMsg',
                label: 'Error Message',
                placeholder: 'Enter Error Message',
                defaultValue: activity.validations.resourceActivityValidations?.[0]?.errorMessage,
                onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                  dispatch(
                    updateStoreActivity(
                      [
                        {
                          ...activity.validations.resourceActivityValidations[0],
                          errorMessage: e.target.value,
                        },
                      ],
                      activity.id,
                      ['validations', 'resourceActivityValidations'],
                    ),
                  );
                },
              },
            },
          ]}
        />
      )}
    </NumberWrapper>
  );
};

export default NumberActivity;
