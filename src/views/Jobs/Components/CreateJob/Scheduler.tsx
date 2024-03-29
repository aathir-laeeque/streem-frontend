import { FormGroup } from '#components';
import { InputTypes } from '#utils/globalTypes';
import { formatDateTime } from '#utils/timeUtils';
import { ReadOnlyGroup } from '#views/Ontology/ObjectTypes';
import { getUnixTime } from 'date-fns';
import React, { FC } from 'react';

export interface SchedulerProps {
  form: any;
}

export const Scheduler: FC<SchedulerProps> = ({ form }) => {
  const { register, watch } = form;

  const { expectedStartDate, expectedEndDate } = watch(['expectedStartDate', 'expectedEndDate']);

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
          {
            type: InputTypes.DATE_TIME,
            props: {
              placeholder: 'End Date & Time',
              label: 'End Date & Time',
              id: 'expectedEndDate',
              name: 'expectedEndDate',
              ref: register({
                required: true,
              }),
            },
          },
        ]}
      />
      {expectedStartDate && (
        <div className="scheduler-summary">
          <h4>Summary</h4>
          <ReadOnlyGroup
            className="read-only-group"
            items={[
              {
                label: 'Start Date and Time',
                value: formatDateTime({
                  value: getUnixTime(new Date(expectedStartDate)),
                }),
              },
              ...(expectedEndDate
                ? [
                    {
                      label: 'End Date and Time',
                      value: formatDateTime({
                        value: getUnixTime(new Date(expectedEndDate)),
                      }),
                    },
                  ]
                : []),
            ]}
          />
        </div>
      )}
    </>
  );
};
