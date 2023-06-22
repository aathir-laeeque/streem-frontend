import { FormGroup } from '#components';
import { InputTypes } from '#utils/globalTypes';
import { ReadOnlyGroup } from '#views/Ontology/ObjectTypes';
import { compact } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect } from 'react';
import { RRule, Weekday } from 'rrule';

export interface SchedulerProps {
  form: any;
  readOnly?: boolean;
}

function getMonthlyOption(mJsDate: moment.Moment) {
  const weekNo = Math.ceil(mJsDate.date() / 7);
  return {
    label: `${
      weekNo === 1 ? 'First' : weekNo === 2 ? 'Second' : weekNo === 3 ? 'Third' : 'Fourth'
    } ${mJsDate.format('dddd')} of every month`,
    weekNo,
  };
}

const ALL_WEEKDAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

const getUpdatedWeekDays = (weekDayIndex: string, weekDays?: Record<string, boolean>) => {
  const weekDay = ALL_WEEKDAYS[Number(weekDayIndex)];
  if (weekDay) {
    let updatedWeekDays = { ...weekDays };
    updatedWeekDays = {
      ...updatedWeekDays,
      [weekDayIndex]: !updatedWeekDays?.[weekDayIndex],
    };
    return { ...updatedWeekDays };
  }
};

export const Scheduler: FC<SchedulerProps> = ({ form, readOnly }) => {
  const { register, unregister, setValue, watch, errors, getValues } = form;

  const {
    expectedStartDate,
    recurrence,
    dueDateDuration,
    repeatEvery,
    repeatCount,
    rRuleOptions,
    dueDateInterval,
    weekDays,
  } = watch([
    'expectedStartDate',
    'recurrence',
    'dueDateDuration',
    'repeatEvery',
    'repeatCount',
    'rRuleOptions',
    'dueDateInterval',
    'weekDays',
  ]);

  useEffect(() => {
    moment.updateLocale('en', {
      week: {
        dow: 1, // Monday is the first day of the week.
      },
    });
  }, []);

  register('recurrence', {
    required: true,
  });
  register('dueDateInterval', {
    required: true,
  });
  register('weekDays');

  const { year, month, week, day, hour, minute } = dueDateDuration;

  useEffect(() => {
    if (dueDateDuration) {
      updateDueDateInterval();
    }
  }, [year, month, week, day, hour, minute]);

  useEffect(() => {
    setValue(
      'rRuleOptions',
      {
        byweekday: compact(Object.keys(weekDays || {}))
          .filter((key) => weekDays[key] !== false)
          .map((key) => new Weekday(Number(key))),
      },
      {
        shouldValidate: true,
      },
    );
  }, [weekDays]);

  useEffect(() => {
    if (recurrence === 'custom') {
      register('repeatEvery');
    } else {
      unregister('repeatEvery');
    }
  }, [recurrence]);

  useEffect(() => {
    if (expectedStartDate) {
      unregister('rRuleOptions');
      unregister('weekDays');
      setValue('recurrence', 'DAILY', {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [expectedStartDate]);

  const updateDueDateInterval = () => {
    let durationSeconds = 0;
    Object.entries(dueDateDuration).forEach(([key, value]: any) => {
      if (value) durationSeconds += moment.duration(value, key).asSeconds();
    });
    setValue('dueDateInterval', durationSeconds, {
      shouldValidate: true,
    });
  };

  const updateWeekDays = (weekDayIndex: string) => {
    const updated = getUpdatedWeekDays(weekDayIndex, weekDays);
    setValue('weekDays', updated, { shouldValidate: true });
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

  const getRecurrenceSummary = () => {
    try {
      if (recurrence !== 'none') {
        const freq = recurrence === 'custom' ? repeatEvery : recurrence;
        const rule = new RRule({
          freq: RRule[freq as keyof typeof RRule],
          interval: repeatCount || 1,
          dtstart: moment(expectedStartDate).toDate(),
          ...(rRuleOptions || {}),
        });
        let recurrenceString = rule?.toText() || null;
        if (recurrenceString) {
          if (recurrence === 'custom') {
            switch (freq) {
              case 'DAILY':
              case 'WEEKLY':
              case 'MONTHLY':
                recurrenceString = `Repeat ${recurrenceString} at ${moment(
                  expectedStartDate,
                ).format('hh:mm A')}`;
                break;
              case 'YEARLY':
                recurrenceString = `Repeat ${recurrenceString} on ${moment(
                  expectedStartDate,
                ).format('Do MMMM [at] hh:mm A')}`;
                break;

              default:
                break;
            }
          } else {
            switch (freq) {
              case 'DAILY':
                recurrenceString = `Repeat ${recurrenceString} at ${moment(
                  expectedStartDate,
                ).format('hh:mm A')}`;
                break;
              case 'WEEKLY':
                recurrenceString = `Repeat ${recurrenceString} on ${moment(
                  expectedStartDate,
                ).format('[at] hh:mm A')}`;
                break;
              case 'MONTHLY':
                recurrenceString = `Repeat ${recurrenceString} on ${moment(
                  expectedStartDate,
                ).format('Do [at] hh:mm A')}`;
                break;
              case 'YEARLY':
                recurrenceString = `Repeat ${recurrenceString} on ${moment(
                  expectedStartDate,
                ).format('Do MMMM [at] hh:mm A')}`;
                break;

              default:
                break;
            }
          }
          return [
            {
              label: 'Recurrence',
              value: recurrenceString,
            },
          ];
        }
      }
      return [];
    } catch (e) {
      console.error('Error while creating recurrence string', e);
      return [];
    }
  };

  let recurrenceOptions: any[] = [];

  let monthlyOptions: any[] = [];

  if (expectedStartDate) {
    recurrenceOptions = [
      {
        label: `Daily at ${moment(expectedStartDate).format('hh:mm A')}`,
        value: 'DAILY',
      },
      {
        label: `Weekly on ${moment(expectedStartDate).format('dddd [at] hh:mm A')}`,
        value: 'WEEKLY',
      },
      {
        label: `Monthly on ${moment(expectedStartDate).format('Do [at] hh:mm A')}`,
        value: 'MONTHLY',
      },
      {
        label: `Annually on ${moment(expectedStartDate).format('Do MMMM [at] hh:mm A')}`,
        value: 'YEARLY',
      },
      {
        label: 'Custom',
        value: 'custom',
      },
    ];

    const { label, weekNo } = getMonthlyOption(moment(expectedStartDate));

    monthlyOptions = [
      {
        label: `${moment(expectedStartDate).format('Do')} of every month`,
        value: {
          bymonthday: moment(expectedStartDate).format('DD'),
        },
      },
      {
        label,
        value: {
          byweekday: new Weekday(Number(moment(expectedStartDate).format('e')), weekNo),
        },
      },
    ];
  }

  const repeatEveryOptions = [
    {
      label: repeatCount > 1 ? 'Days' : 'Day',
      value: 'DAILY',
    },
    {
      label: repeatCount > 1 ? 'Weeks' : 'Week',
      value: 'WEEKLY',
    },
    {
      label: repeatCount > 1 ? 'Months' : 'Month',
      value: 'MONTHLY',
    },
    {
      label: repeatCount > 1 ? 'Years' : 'Year',
      value: 'YEARLY',
    },
  ];

  return !readOnly ? (
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
      <FormGroup
        key="recurrence-section"
        inputs={[
          {
            type: InputTypes.SINGLE_SELECT,
            props: {
              id: 'recurrence',
              label: 'Recurrence',
              options: recurrenceOptions,
              isSearchable: false,
              placeholder: 'Select Recurrence',
              value: recurrence
                ? recurrenceOptions?.filter((curr) => curr?.value === recurrence)
                : null,
              isDisabled: !expectedStartDate,
              onChange: (option: { value: string }) => {
                setValue('recurrence', option.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                if (option.value === 'custom') {
                  register('repeatEvery', {
                    required: true,
                  });
                  setValue('repeatEvery', 'DAILY', {
                    shouldValidate: true,
                  });
                } else {
                  unregister('repeatEvery');
                }
              },
            },
          },
        ]}
      />
      {recurrence === 'custom' && (
        <>
          <p className="custom-label">Repeat Every</p>
          <div className="custom-recurrence-section">
            <FormGroup
              key="custom-recurrence-section"
              inputs={[
                {
                  type: InputTypes.NUMBER,
                  props: {
                    placeholder: 'Repeat Every',
                    label: '',
                    id: 'repeatCount',
                    name: 'repeatCount',
                    defaultValue: 1,
                    ref: register({
                      required: true,
                      valueAsNumber: true,
                      min: 1,
                    }),
                  },
                },
                {
                  type: InputTypes.SINGLE_SELECT,
                  props: {
                    id: 'repeatEvery',
                    label: '',
                    options: repeatEveryOptions,
                    isSearchable: false,
                    placeholder: 'Select',
                    value: repeatEveryOptions.filter((o) => o.value === repeatEvery),
                    onChange: (option: { value: string }) => {
                      setValue('repeatEvery', option.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                      if (['MONTHLY', 'WEEKLY'].includes(option.value)) {
                        register('rRuleOptions', {
                          required: true,
                        });
                        if (option.value === 'MONTHLY') {
                          setValue('rRuleOptions', monthlyOptions[0].value, {
                            shouldValidate: true,
                          });
                        } else {
                          updateWeekDays(moment(expectedStartDate).format('e'));
                        }
                      } else {
                        unregister('rRuleOptions');
                      }
                    },
                  },
                },
              ]}
            />
          </div>
        </>
      )}
      {repeatEvery === 'MONTHLY' && (
        <div className="custom-recurrence-section">
          <FormGroup
            key="custom-recurrence-monthly-section"
            inputs={[
              {
                type: InputTypes.SINGLE_SELECT,
                props: {
                  id: 'rRuleOptions',
                  label: 'Repeat on',
                  options: monthlyOptions,
                  isSearchable: false,
                  placeholder: 'Select',
                  defaultValue: monthlyOptions[0],
                  onChange: (option: { value: string }) => {
                    setValue('rRuleOptions', option.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  },
                },
              },
            ]}
          />
        </div>
      )}
      {repeatEvery === 'WEEKLY' && (
        <div className="custom-recurrence-section" style={{ flexDirection: 'column' }}>
          <p className="custom-label">Repeat on</p>
          <div className="week-day-container">
            {ALL_WEEKDAYS.map((weekDay, index) => (
              <span
                className="week-day"
                style={
                  weekDays?.[index.toString()] ? { backgroundColor: '#1d84ff', color: '#fff' } : {}
                }
                onClick={() => updateWeekDays(index.toString())}
              >
                {weekDay}
              </span>
            ))}
          </div>
        </div>
      )}
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
              ...getRecurrenceSummary(),
            ]}
          />
        </div>
      )}
    </>
  ) : (
    <>
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
            ...getRecurrenceSummary(),
          ]}
        />
      </div>
    </>
  );
};
