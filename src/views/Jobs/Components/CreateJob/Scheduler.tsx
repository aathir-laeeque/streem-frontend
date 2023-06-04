import { FormGroup } from '#components';
import { InputTypes } from '#utils/globalTypes';
import { ReadOnlyGroup } from '#views/Ontology/ObjectTypes';
import moment from 'moment';
import React, { FC, useEffect } from 'react';

export interface SchedulerProps {
  form: any;
}

export const Scheduler: FC<SchedulerProps> = ({ form }) => {
  const { register, setValue, watch, errors } = form;

  useEffect(() => {
    moment.updateLocale('en', {
      week: {
        dow: 1, // Monday is the first day of the week.
      },
    });

    register('dueDateInterval', {
      required: true,
    });
    setValue('dueDateInterval', 0, {
      shouldValidate: true,
    });
  }, []);

  const { expectedStartDate, dueDateDuration } = watch(['expectedStartDate', 'dueDateDuration']);

  useEffect(() => {
    if (dueDateDuration) updateDueDateInterval();
  }, [dueDateDuration]);

  const updateDueDateInterval = () => {
    let durationSeconds = 0;
    Object.entries(dueDateDuration).forEach(([key, value]: any) => {
      if (value) durationSeconds += moment.duration(value, key).asSeconds();
    });
    setValue('dueDateInterval', durationSeconds, {
      shouldValidate: true,
    });
  };

  const getDueOnSummary = () => {
    if (dueDateDuration) {
      const { isValid, values } = Object.entries(dueDateDuration).reduce<any>(
        (acc, [key, value]: any) => {
          if (value) {
            acc.isValid = true;
            acc.values.push(` ${value} ${value > 1 ? `${key}s` : key}`);
          }
          return acc;
        },
        { isValid: false, values: [] },
      );
      if (isValid) {
        return [
          {
            label: 'Due in',
            value: values.join() + ' from Start',
          },
        ];
      }
    }
    return [];
  };

  return (
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
              ref: register({
                required: true,
              }),
            },
          },
        ]}
      />
      <p className="custom-label">Due After</p>
      <div className="due-after-section">
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
      )}
    </>
  );
};
