import { BaseModal, FormGroup } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { InputTypes } from '#utils/globalTypes';
import { ReadOnlyGroup } from '#views/Ontology/ObjectTypes';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { removeTaskRecurrence, setTaskRecurrence } from '#PrototypeComposer/Tasks/actions';
import { Task } from '#PrototypeComposer/checklist.types';
import { apiGetTaskRecurrence } from '#utils/apiUrls';
import { request } from '#utils/request';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { getSummary } from '#utils/summaryUtils';
import { calculateSecondsFromDuration } from '#utils/timeUtils';

export interface TaskRecurrenceModalProps {
  task: Task;
  isReadOnly: boolean;
}

const Wrapper = styled.div.attrs({})`
  .modal {
    min-width: 700px !important;
    max-width: 720px !important;

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

      .task-recurrence {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .due-after-section,
      .start-after-section {
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
          font-size: 14px;
          color: #525252;
          .read-only {
            margin-bottom: 16px;
          }
        }
      }
    }

    .modal-footer {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .remove-recurrence {
        color: red;
        font-size: 14px;
        line-height: 16px;
        font-weight: 400;
        cursor: pointer;
      }
    }
  }
`;

const TaskRecurrenceModal: FC<CommonOverlayProps<TaskRecurrenceModalProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { task, isReadOnly },
}) => {
  const [recurrence, setRecurrence] = useState<any>(null);
  const dispatch = useDispatch();

  const { enableRecurrence } = task || {};

  const form = useForm<{
    startDateDuration: Record<string, number>;
    startDateInterval: number;
    dueDateDuration: Record<string, number>;
    dueDateInterval: number;
  }>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    defaultValues: {
      startDateDuration: { day: 0, hour: 0, minute: 0 },
      startDateInterval: 0,
      dueDateDuration: { day: 0, hour: 0, minute: 0 },
      dueDateInterval: 0,
    },
  });

  const {
    handleSubmit,
    register,
    setValue,
    errors,
    watch,
    reset,
    formState: { isDirty, isValid },
  } = form;

  const validateInterval = (value: number) => {
    if (value > 0) {
      return true;
    }
    return false;
  };

  register('startDateInterval', {
    required: true,
    validate: validateInterval,
  });

  register('dueDateInterval', {
    required: true,
    validate: validateInterval,
  });

  const { startDateDuration, dueDateDuration, startDateInterval, dueDateInterval } = watch([
    'startDateDuration',
    'dueDateDuration',
    'startDateInterval',
    'dueDateInterval',
  ]);

  const getRecurrence = async (taskId: string) => {
    try {
      const { data } = await request('GET', apiGetTaskRecurrence(taskId));
      if (data) {
        setRecurrence(data);
      }
    } catch (error) {
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
        }),
      );
    }
  };

  const onSetTaskRecurrence = (data: any) => {
    dispatch(
      setTaskRecurrence({
        taskId: task.id,
        startDateDuration: data.startDateDuration,
        startDateInterval: data.startDateInterval,
        dueDateDuration: data.dueDateDuration,
        dueDateInterval: data.dueDateInterval,
      }),
    );
  };

  const onRemoveTaskRecurrence = () => {
    dispatch(removeTaskRecurrence(task.id));
  };

  const updateDueDateInterval = (duration: Record<string, number>, intervalToBeSet: string) => {
    const durationSeconds = calculateSecondsFromDuration(duration);
    setValue(intervalToBeSet, durationSeconds, {
      shouldValidate: true,
    });
  };

  const { day: startDay, hour: startHour, minute: startMinute } = startDateDuration || {};
  const { day: dueDay, hour: dueHour, minute: dueMinute } = dueDateDuration || {};

  useEffect(() => {
    if (enableRecurrence && recurrence) {
      reset({
        startDateDuration: recurrence?.startDateDuration,
        startDateInterval: recurrence?.startDateInterval,
        dueDateDuration: recurrence?.dueDateDuration,
        dueDateInterval: recurrence?.dueDateInterval,
      });
    }
  }, [recurrence]);

  useEffect(() => {
    if (dueDateDuration) {
      updateDueDateInterval(dueDateDuration, 'dueDateInterval');
    }
  }, [dueDay, dueHour, dueMinute]);

  useEffect(() => {
    if (startDateDuration) {
      updateDueDateInterval(startDateDuration, 'startDateInterval');
    }
  }, [startDay, startHour, startMinute]);

  useEffect(() => {
    if (task?.id) {
      getRecurrence(task?.id);
    }
  }, []);

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        title="Task Recurrence"
        primaryText="Save"
        closeModal={closeOverlay}
        showSecondary={false}
        modalFooterOptions={
          <div
            onClick={() => {
              onRemoveTaskRecurrence();
            }}
            className="remove-recurrence"
          >
            {enableRecurrence ? 'Remove Task Recurrence' : ''}
          </div>
        }
        disabledPrimary={!isValid || !isDirty}
        onPrimary={handleSubmit((data) => onSetTaskRecurrence(data))}
        showFooter={!isReadOnly}
      >
        <div>
          {!enableRecurrence && isReadOnly ? (
            <div>Task Recurrence is not set.</div>
          ) : (
            <div className="task-recurrence">
              <div>
                <p className="custom-label">Start Task After </p>
                <div className="start-after-section">
                  <FormGroup
                    key="start-after-section"
                    inputs={[
                      {
                        type: InputTypes.NUMBER,
                        props: {
                          placeholder: 'Day',
                          label: 'Day',
                          id: 'startDateDuration.day',
                          name: 'startDateDuration.day',
                          error: !!errors?.startDateDuration?.day,
                          defaultValue: 0,
                          ref: register({
                            required: true,
                            valueAsNumber: true,
                            min: 0,
                            pattern: /^\d+$/, // Regex pattern to allow only positive integers, no decimals allowed
                          }),
                          disabled: isReadOnly,
                        },
                      },
                      {
                        type: InputTypes.NUMBER,
                        props: {
                          placeholder: 'Hour',
                          label: 'Hour',
                          id: 'startDateDuration.hour',
                          name: 'startDateDuration.hour',
                          error: !!errors?.startDateDuration?.hour,
                          defaultValue: 0,
                          ref: register({
                            required: true,
                            valueAsNumber: true,
                            min: 0,
                            pattern: /^\d+$/,
                          }),
                          disabled: isReadOnly,
                        },
                      },
                      {
                        type: InputTypes.NUMBER,
                        props: {
                          placeholder: 'Minute',
                          label: 'Minute',
                          id: 'startDateDuration.minute',
                          name: 'startDateDuration.minute',
                          error: !!errors?.startDateDuration?.minute,
                          defaultValue: 0,
                          ref: register({
                            required: true,
                            valueAsNumber: true,
                            min: 0,
                            pattern: /^\d+$/,
                          }),
                          disabled: isReadOnly,
                        },
                      },
                    ]}
                  />
                </div>
                <p className="custom-label" style={{ color: '#6F6F6F' }}>
                  This is the minimum time interval after which the next task instance should be
                  started.
                </p>
              </div>

              <div>
                <p className="custom-label">Task Due After </p>
                <div className="due-after-section">
                  <FormGroup
                    key="due-after-section"
                    inputs={[
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
                            pattern: /^\d+$/,
                          }),
                          disabled: isReadOnly,
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
                            pattern: /^\d+$/,
                          }),
                          disabled: isReadOnly,
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
                            pattern: /^\d+$/,
                          }),
                          disabled: isReadOnly,
                        },
                      },
                    ]}
                  />
                </div>
                <p className="custom-label" style={{ color: '#6F6F6F' }}>
                  This is the time within which the task should be completed, after which it will be
                  marked as overdue.
                </p>
              </div>

              {startDateInterval || dueDateInterval ? (
                <div className="scheduler-summary">
                  <h4>Summary</h4>
                  <ReadOnlyGroup
                    className="read-only-group"
                    items={[
                      {
                        label: 'Start Task After',
                        value: getSummary(startDateDuration),
                      },
                      {
                        label: 'Task Due After',
                        value: getSummary(dueDateDuration),
                      },
                    ]}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TaskRecurrenceModal;
