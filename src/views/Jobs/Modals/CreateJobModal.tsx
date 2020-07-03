import { BaseModal, FloatInput } from '#components';
import { Properties } from '#store/properties/types';
import { Checklist } from '#views/Checklists/types';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

interface CreateJobModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  selectedChecklist: Checklist;
  properties: Properties;
  onCreateJob: (jobDetails: Record<string, string>) => void;
}

const Wrapper = styled.div.attrs({})``;

export const CreateJobModal: FC<CreateJobModalProps> = ({
  closeAllModals,
  closeModal,
  properties,
  onCreateJob,
  selectedChecklist,
}) => {
  const [jobDetails, setJobDetails] = useState<Record<string, string>>({});

  const onInputChange = (id: string, value: string) => {
    const temp = { ...jobDetails };
    temp[id] = value;
    setJobDetails(temp);
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        title="Creating a Job"
        successText="Create Job"
        cancelText="Cancel"
        onSuccess={() => onCreateJob(jobDetails)}
        modalFooterOptions={
          <span style={{ color: `#12aab3`, fontWeight: 600, fontSize: 12 }}>
            Schedule Job
          </span>
        }
      >
        <FloatInput
          placeHolder="Choose a Checklist"
          label="Checklist"
          value={`${selectedChecklist.code} ${selectedChecklist.name}`}
          id="checklistId"
          onChange={onInputChange}
          required
          disabled
        />
        {properties.map((property, index) => (
          <FloatInput
            key={`property_${index}`}
            placeHolder={property.placeHolder}
            label={property.name}
            id={property.name}
            value={jobDetails[property.name] || ''}
            onChange={onInputChange}
            required={property.mandatory}
          />
        ))}
      </BaseModal>
    </Wrapper>
  );
};
