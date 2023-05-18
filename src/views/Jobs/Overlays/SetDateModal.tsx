import { BaseModal, FormGroup } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { InputTypes } from '#utils/globalTypes';
import { ReadOnlyGroup } from '#views/Ontology/ObjectTypes';
import moment from 'moment';
import React, { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateJob } from '../ListView/actions';
import { useTypedSelector } from '#store';

export interface SetDateModalProps {
  jobId: string;
}

const Wrapper = styled.div.attrs({})`
  .modal {
    min-width: 700px !important;
    max-width: 720px !important;
    max-height: 80vh;

    .modal-body {
      padding: 24px !important;
      overflow: auto;

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
    }

    .modal-footer {
      flex-direction: row-reverse;
    }
  }
`;

const SetDateModal: FC<CommonOverlayProps<SetDateModalProps>> = ({
  closeAllOverlays,
  closeOverlay,
}) => {
  const dispatch = useDispatch();
  const { submitting } = useTypedSelector((state) => state.jobListView);
  const form = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const {
    handleSubmit,
    register,
    formState: { isDirty, isValid },
    setValue,
    errors,
    watch,
    getValues,
  } = form;
  console.log('🚀 ~ file: SetDateModal.tsx:111 ~ getValues:', getValues());

  useEffect(() => {
    // register('dueDateInterval', {
    //   required: true,
    // });
    register('expectedStartDate', {
      required: true,
    });
    register('expectedEndDate', {
      required: true,
    });
    // setValue('dueDateInterval', 0, {
    //   shouldValidate: true,
    // });
  }, []);

  // const { expectedStartDate, dueDateDuration } = watch(['expectedStartDate', 'dueDateDuration']);

  // useEffect(() => {
  //   if (dueDateDuration) updateDueDateInterval();
  // }, [dueDateDuration]);

  // const updateDueDateInterval = () => {
  //   let durationSeconds = 0;
  //   Object.entries(dueDateDuration).forEach(([key, value]: any) => {
  //     if (value) durationSeconds += moment.duration(value, key).asSeconds();
  //   });
  //   setValue('dueDateInterval', durationSeconds, {
  //     shouldValidate: true,
  //   });
  // };

  const onSubmit = (data: any) => {
    console.log(jobId, 'Data', data);
    dispatch(
      updateJob({
        job: {
          id: jobId,
          ...data,
        },
      }),
    );
  };

  const onCloseHandler = () => {
    closeOverlay();
  };

  // const getDueOnSummary = () => {
  //   if (dueDateDuration) {
  //     const { isValid, values } = Object.entries(dueDateDuration).reduce<any>(
  //       (acc, [key, value]: any) => {
  //         if (value) {
  //           acc.isValid = true;
  //           acc.values.push(` ${value} ${value > 1 ? `${key}s` : key}`);
  //         }
  //         return acc;
  //       },
  //       { isValid: false, values: [] },
  //     );
  //     if (isValid) {
  //       return [
  //         {
  //           label: 'Due in',
  //           value: values.join() + ' from Start',
  //         },
  //       ];
  //     }
  //   }
  //   return [];
  // };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={onCloseHandler}
        title="Schedule"
        primaryText="Save"
        secondaryText="Cancel"
        disabledPrimary={!isValid || !isDirty || submitting}
        onPrimary={handleSubmit((data) => onSubmit(data))}
      >
        <form>
          <>
            <FormGroup
              key="basic-info-section"
              inputs={[
                {
                  type: InputTypes.DATE_TIME,
                  props: {
                    placeholder: 'Start Date & Time',
                    label: 'Start Date & Time',
                    id: 'expectedStartDate',
                    name: 'expectedStartDate',
                    // ref: register({
                    //   required: true,
                    // }),
                    onChange: ({ value }) => {
                      setValue('expectedStartDate', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  },
                },
                {
                  type: InputTypes.DATE_TIME,
                  props: {
                    placeholder: 'End Date & Time',
                    label: 'End Date & Time',
                    id: 'expectedEndDate',
                    name: 'expectedEndDate',
                    // ref: register({
                    //   required: true,
                    // }),
                    onChange: ({ value }) => {
                      setValue('expectedEndDate', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  },
                },
              ]}
            />
            {/* <p className="custom-label">Due After</p> */}
            {/* <div className="due-after-section">
              <FormGroup
                key="due-after-section"
                inputs={[
                  {
                    type: InputTypes.NUMBER,
                    props: {
                      placeholder: 'Year',
                      label: 'Year',
                      id: 'dueDateDuration.year',
                      name: 'dueDateDuration.year',
                      defaultValue: 0,
                      error: !!errors?.dueDateDuration?.year,
                      ref: register({
                        required: true,
                        valueAsNumber: true,
                        min: 0,
                      }),
                    },
                  },
                  {
                    type: InputTypes.NUMBER,
                    props: {
                      placeholder: 'Month',
                      label: 'Month',
                      id: 'dueDateDuration.month',
                      name: 'dueDateDuration.month',
                      defaultValue: 0,
                      error: !!errors?.dueDateDuration?.month,
                      ref: register({
                        required: true,
                        valueAsNumber: true,
                        min: 0,
                      }),
                    },
                  },
                  {
                    type: InputTypes.NUMBER,
                    props: {
                      placeholder: 'Week',
                      label: 'Week',
                      id: 'dueDateDuration.week',
                      name: 'dueDateDuration.week',
                      error: !!errors?.dueDateDuration?.week,
                      defaultValue: 0,
                      ref: register({
                        required: true,
                        valueAsNumber: true,
                        min: 0,
                      }),
                    },
                  },
                  {
                    type: InputTypes.NUMBER,
                    props: {
                      placeholder: 'Day',
                      label: 'Day',
                      id: 'dueDateDuration.day',
                      name: 'dueDateDuration.day',
                      error: !!errors?.dueDateDuration?.day,
                      defaultValue: 0,
                      ref: register({
                        required: true,
                        valueAsNumber: true,
                        min: 0,
                      }),
                    },
                  },
                  {
                    type: InputTypes.NUMBER,
                    props: {
                      placeholder: 'Hour',
                      label: 'Hour',
                      id: 'dueDateDuration.hour',
                      name: 'dueDateDuration.hour',
                      error: !!errors?.dueDateDuration?.hour,
                      defaultValue: 0,
                      ref: register({
                        required: true,
                        valueAsNumber: true,
                        min: 0,
                      }),
                    },
                  },
                  {
                    type: InputTypes.NUMBER,
                    props: {
                      placeholder: 'Minute',
                      label: 'Minute',
                      id: 'dueDateDuration.minute',
                      name: 'dueDateDuration.minute',
                      error: !!errors?.dueDateDuration?.minute,
                      defaultValue: 0,
                      ref: register({
                        required: true,
                        valueAsNumber: true,
                        min: 0,
                      }),
                    },
                  },
                ]}
              />
            </div>
            {expectedStartDate && (
              <div className="scheduler-summary">
                <h4>Summary</h4>
                <ReadOnlyGroup
                  className="read-only-group"
                  items={[
                    {
                      label: 'Start Date and Time',
                      value: moment(expectedStartDate).format('Do MMMM, YYYY [at] hh:mm A'),
                    },
                    ...getDueOnSummary(),
                  ]}
                />
              </div>
            )} */}
          </>
        </form>
      </BaseModal>
    </Wrapper>
  );
};

export default SetDateModal;
