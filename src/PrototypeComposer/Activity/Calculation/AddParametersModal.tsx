import { BaseModal, Button1, Select, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { ActivityType } from '#JobComposer/checklist.types';
import { Activity } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import { apiGetActivitiesForCalc } from '#utils/apiUrls';
import { request } from '#utils/request';
import { CircularProgress } from '@material-ui/core';
import { Add, DragHandle, RemoveCircleOutline } from '@material-ui/icons';
import { isEmpty, debounce } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateStoreActivity } from '../actions';

type CalcActivityVariablesDataType = {
  [paramName: string]: {
    taskId: string;
    activityId: string;
    label: string;
  };
};

const Wrapper = styled.div`
  .modal {
    .modal-header {
      color: #161616 !important;
      border-bottom: 1px solid #e0e0e0 !important;
    }

    .modal-body {
      padding: 0 !important;
      .add-params-modal-body {
        padding: 16px;
        overflow-y: auto;

        .param-details-row:not(:last-child) {
          margin-bottom: 16px;
        }

        .param-details-row {
          .row-header {
            margin-bottom: 8px;
            font-size: 14px;
            color: #525252;
            display: grid;
            grid-template-columns: 30% 5% 55% 5%;
            column-gap: 2%;

            .header-label {
              text-align: start;
            }
          }

          .row-content {
            display: grid;
            align-items: center;
            grid-template-columns: 30% 5% 55% 5%;
            column-gap: 2%;

            .add-param-form-error {
              color: #da1e28;
              font-size: 12px;
              text-align: start;
            }
          }
        }

        .add-new-params-btn {
          margin-top: 16px;
          border-radius: 1px;
        }
      }

      .add-params-modal-footer {
        border-top: 1px solid #e0e0e0 !important;
        display: flex;
        align-items: center;
        padding: 16px;
        justify-content: flex-end;
      }
    }
  }
`;

export const CalcActivityAddParamsModal: FC<
  CommonOverlayProps<{
    variables: CalcActivityVariablesDataType;
    activityId: Activity['id'];
  }>
> = ({ closeAllOverlays, closeOverlay, props: { variables, activityId } }) => {
  const dispatch = useDispatch();
  const { id: checklistId } = useTypedSelector(
    (state) => state.prototypeComposer.data,
  );

  const [loading, setLoading] = useState<Boolean>(false);

  const [activitiesForCalc, updateActivitiesForCalc] = useState<
    { id: string; type: ActivityType; label: string; taskId: string }[]
  >([]);
  const [params, setParams] = useState<
    {
      variableName: string;
      activityId: string | undefined;
      taskId: string | undefined;
      label: string;
    }[]
  >(
    isEmpty(variables)
      ? [
          {
            variableName: '',
            activityId: undefined,
            taskId: undefined,
            label: '',
          },
        ]
      : Object.entries(variables).map(
          ([variableName, { activityId, taskId, label }]) => {
            return {
              variableName,
              activityId,
              taskId,
              label,
            };
          },
        ),
  );

  const [formErrors, setFormErrors] = useState<
    { paramNameError: string | undefined; paramError: string | undefined }[]
  >(
    isEmpty(variables)
      ? [{ paramNameError: undefined, paramError: undefined }]
      : Object.values(variables).map(() => {
          return {
            paramNameError: undefined,
            paramError: undefined,
          };
        }),
  );

  useEffect(() => {
    setLoading(true);
    const getActivitiesForCalc = async () => {
      if (checklistId) {
        const activitiesForCalc = await request(
          'GET',
          apiGetActivitiesForCalc(checklistId),
        );
        updateActivitiesForCalc(
          activitiesForCalc.data.filter(
            (activity: { id: string }) => activity.id !== activityId,
          ),
        );
      }
    };
    getActivitiesForCalc();
    setLoading(false);
  }, []);

  const validateFormFields = () => {
    let allFormFieldsValid = true;
    // TODO check the if conditions for setting Errors
    params.forEach((paramObj, index) => {
      if (!paramObj.variableName || paramObj.variableName.length === 0) {
        setFormErrors((oldFormErrors) => {
          const updatedFormErrors = [...oldFormErrors];
          updatedFormErrors[index].paramNameError =
            'Parameter name cannot be empty';
          allFormFieldsValid = false;
          return updatedFormErrors;
        });
        allFormFieldsValid = false;
      }

      if (!paramObj.activityId || paramObj.variableName.length === 0) {
        setFormErrors((oldFormErrors) => {
          const updatedFormErrors = [...oldFormErrors];
          updatedFormErrors[index].paramError =
            'Atleast one Parameter must be selected';
          return updatedFormErrors;
        });
        allFormFieldsValid = false;
      }
    });

    return allFormFieldsValid;
  };

  const updateStoreParams = () => {
    const allFormFieldsValid = validateFormFields();
    if (allFormFieldsValid) {
      const updatedStoreParams = params.reduce((o, paramObj) => {
        return {
          ...o,
          [paramObj.variableName]: {
            activityId: paramObj.activityId,
            taskId: paramObj.taskId,
            label: paramObj.label,
          },
        };
      }, {});

      dispatch(
        updateStoreActivity(updatedStoreParams, activityId, [
          'data',
          'variables',
        ]),
      );
      closeOverlay();
    }
  };

  console.log('params', params);

  return (
    <Wrapper>
      <BaseModal
        title="Add Parameter"
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showFooter={false}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <div className="add-params-modal-body">
              <div>
                {params.map((param, index) => (
                  <div key={index} className="param-details-row">
                    <div className="row-header">
                      <div className="header-label">Parameter Name</div>
                      <div />
                      <div className="header-label">Select Parameter</div>
                      <div />
                    </div>
                    <div className="row-content">
                      <div>
                        <TextInput
                          error={!!formErrors[index].paramNameError}
                          placeholder="X"
                          defaultValue={param.variableName}
                          onChange={debounce((value) => {
                            setParams((oldParams) => {
                              const updatedParams = [...oldParams];
                              updatedParams[index].variableName = value.value;
                              return updatedParams;
                            });
                            setFormErrors((oldFormErrors) => {
                              const updatedFormErrors = [...oldFormErrors];
                              updatedFormErrors[index].paramNameError =
                                undefined;
                              return updatedFormErrors;
                            });
                          })}
                        />
                        {formErrors[index].paramNameError && (
                          <div className="add-param-form-error">
                            {formErrors[index].paramError}
                          </div>
                        )}
                      </div>
                      <DragHandle />
                      <div>
                        <Select
                          error={!!formErrors[index].paramNameError}
                          options={activitiesForCalc.map((activity) => {
                            return {
                              label: activity.label,
                              value: activity.id,
                            };
                          })}
                          selectedValue={
                            param?.activityId
                              ? {
                                  value: param.activityId,
                                  label: param.label,
                                }
                              : undefined
                          }
                          placeholder="Select"
                          onChange={(option) => {
                            setParams((oldParams) => {
                              const updatedParams = [...oldParams];
                              updatedParams[index].activityId = (
                                option as { value: string }
                              ).value;
                              const selectedActivity = activitiesForCalc.find(
                                (activity) =>
                                  activity.id ===
                                  (option as { value: string }).value,
                              );
                              if (selectedActivity) {
                                updatedParams[index].taskId =
                                  selectedActivity.taskId;
                                updatedParams[index].label =
                                  selectedActivity.label;
                              }
                              return updatedParams;
                            });
                            setFormErrors((oldFormErrors) => {
                              const updatedFormErrors = [...oldFormErrors];
                              updatedFormErrors[index].paramError = undefined;
                              return updatedFormErrors;
                            });
                          }}
                        />
                        {formErrors[index].paramError && (
                          <div className="add-param-form-error">
                            {formErrors[index].paramError}
                          </div>
                        )}
                      </div>
                      {params.length > 1 && (
                        <RemoveCircleOutline
                          style={{ color: '#DA1E28', cursor: 'pointer' }}
                          onClick={() => {
                            setParams((oldParams) => {
                              const updatedParams = [...oldParams];
                              updatedParams.splice(index, 1);
                              return updatedParams;
                            });
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button1
                variant="secondary"
                className="add-new-params-btn"
                onClick={() => {
                  setParams((oldParams) => {
                    const updatedParams = [...oldParams];
                    updatedParams.push({
                      variableName: '',
                      activityId: undefined,
                      taskId: undefined,
                      label: '',
                    });
                    return updatedParams;
                  });

                  setFormErrors((oldFormErrors) => {
                    const updatedFormErrors = [...oldFormErrors];
                    updatedFormErrors.push({
                      paramError: undefined,
                      paramNameError: undefined,
                    });
                    return updatedFormErrors;
                  });
                }}
              >
                Add <Add style={{ fontSize: '14px', marginLeft: '5px' }} />
              </Button1>
            </div>
            <div className="add-params-modal-footer">
              <Button1 variant="secondary" onClick={closeOverlay}>
                Cancel
              </Button1>
              <Button1 variant="primary" onClick={updateStoreParams}>
                Save
              </Button1>
            </div>
          </>
        )}
      </BaseModal>
    </Wrapper>
  );
};
