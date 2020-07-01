import { BaseModal, FloatInput } from '#components';
import { Properties } from '#store/properties/types';
import { Checklist } from '#views/Checklists/types';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

interface CreateTaskModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  selectedChecklist: Checklist;
  properties: Properties;
  onCreateTask: (taskDetails: Record<string, string>) => void;
}

const Wrapper = styled.div.attrs({})``;

export const CreateTaskModal: FC<CreateTaskModalProps> = ({
  closeAllModals,
  closeModal,
  properties,
  onCreateTask,
  selectedChecklist,
}) => {
  const [taskDetails, setTaskDetails] = useState<Record<string, string>>({});

  const onInputChange = (id: string, value: string) => {
    const temp = { ...taskDetails };
    temp[id] = value;
    setTaskDetails(temp);
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        title="Creating a Task"
        successText="Create Task"
        cancelText="Cancel"
        onSuccess={() => onCreateTask(taskDetails)}
        modalFooterOptions={
          <span style={{ color: `#12aab3`, fontWeight: 600, fontSize: 12 }}>
            Schedule Task
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
            placeHolder={'placeholder - ' + property.name}
            label={property.name}
            id={property.name}
            value={taskDetails[property.name] || ''}
            onChange={onInputChange}
            required={property.mandatory}
          />
        ))}
      </BaseModal>
    </Wrapper>
  );
};
