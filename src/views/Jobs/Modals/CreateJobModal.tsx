import { BaseModal, FloatInput } from '#components';
import { usePrevious } from '#utils/usePrevious';
import { useTypedSelector } from '#store';
import { Properties } from '#store/properties/types';
import { Checklist } from '#views/Checklists/types';
import { useDispatch } from 'react-redux';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

export interface CreateJobModalProps {
  closeAllModals: () => void;
  closeModal: () => void;
  selectedChecklist: Checklist | null;
  properties: Properties;
  onCreateJob: (jobDetails: Record<string, string>) => void;
}

const Wrapper = styled.div.attrs({})`
  .checklists-wrapper-input {
    display: flex;
    flex: 1;
    flex-direction: column-reverse;
    .checklists-wrapper {
      position: absolute;
      top: 120px;
      left: 16px;
      right: 16px;
      background: #fff;
      z-index: 1;
      border-radius: 4px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);

      .checklist-row {
        padding: 8px 12px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        cursor: pointer;
      }

      .checklist-row:hover {
        background-color: rgba(29, 132, 255, 0.2);
      }
    }
  }
`;

export const CreateJobModal: FC<CreateJobModalProps> = ({
  closeAllModals,
  closeModal,
  properties,
  onCreateJob,
  selectedChecklist,
}) => {
  const [jobDetails, setJobDetails] = useState<Record<string, string>>({});

  const { checklists } = useTypedSelector((state) => state.checklistListView);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChecklists, setShowChecklists] = useState(false);

  const prevSearch = usePrevious(searchQuery);

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'OR',
      fields: [
        { field: 'name', op: 'LIKE', values: [searchQuery] },
        { field: 'code', op: 'LIKE', values: [searchQuery] },
      ],
    });
    dispatch(fetchChecklists({ page, size, filters, sort: 'id' }));
  };

  useEffect(() => {
    if (!selectedChecklist) {
      if (prevSearch !== searchQuery) {
        fetchData(0, 10);
      }
    }
  }, [searchQuery]);

  const onInputChange = (id: string, value: string) => {
    const temp = { ...jobDetails };
    temp[id] = value;
    setJobDetails(temp);
  };

  const rowSelected = (checklist: Checklist) => {
    setSearchQuery(checklist.name);
    setShowChecklists(false);
    onInputChange('checklistId', checklist.id.toString());
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        onSecondary={closeModal}
        title="Creating a Job"
        primaryText="Create Job"
        secondaryText="Cancel"
        onPrimary={() => {
          onCreateJob(jobDetails);
          closeModal();
        }}
        disabledPrimary={properties.some(
          (property) => property.mandatory && !jobDetails[property.name],
        )}
      >
        {(selectedChecklist && (
          <FloatInput
            placeHolder="Choose a Checklist"
            label="Checklist"
            value={`${selectedChecklist.code} ${selectedChecklist.name}`}
            id="checklistId"
            onChange={onInputChange}
            required
            disabled
          />
        )) || (
          <div className="checklists-wrapper-input">
            <FloatInput
              placeHolder="Select a Checklist"
              label="Select a Checklist"
              value={searchQuery}
              id="checklistId"
              executeOnFocus={() => setShowChecklists(true)}
              executeOnBlur={() =>
                setTimeout(() => setShowChecklists(false), 500)
              }
              onChange={(id, value) => setSearchQuery(value)}
              required
              isSearch
            />
            {showChecklists && (
              <div className="checklists-wrapper">
                {checklists &&
                  checklists.map((checklist) => (
                    <div
                      className="checklist-row"
                      key={`${checklist.id}`}
                      onClick={() => rowSelected(checklist)}
                    >
                      <span style={{ color: '#666' }}>{checklist.name}</span>
                      <span style={{ color: '#999' }}>{checklist.code}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

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
