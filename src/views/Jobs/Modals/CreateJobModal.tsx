import { BaseModal, FloatInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { usePrevious } from '#utils/usePrevious';
import { useTypedSelector } from '#store';
import { Properties } from '#store/properties/types';
import { Checklist } from '#views/Checklists/types';
import { useDispatch } from 'react-redux';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

export interface CreateJobModalProps {
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
      overflow-y: auto;
      max-height: 250px;

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

export const CreateJobModal: FC<CommonOverlayProps<CreateJobModalProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { properties, onCreateJob, selectedChecklist },
}) => {
  const [jobDetails, setJobDetails] = useState<Record<string, string>>({});

  const { checklists, pageable } = useTypedSelector(
    (state) => state.checklistListView,
  );
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showChecklists, setShowChecklists] = useState(false);

  const prevSearch = usePrevious(searchQuery);

  const fetchData = (page: number, size: number) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        { field: 'code', op: 'LIKE', values: [searchQuery] },
        { field: 'state', op: 'EQ', values: ['PUBLISHED'] },
        { field: 'archived', op: 'EQ', values: [false] },
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
    onInputChange('checklistId', checklist.id);
  };

  const handleOnScroll = (e: React.UIEvent<HTMLElement>) => {
    e.stopPropagation();
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    if (
      scrollTop + clientHeight >= scrollHeight - clientHeight * 0.7 &&
      !pageable.last
    )
      fetchData(pageable.page + 1, 10);
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        onSecondary={closeOverlay}
        title="Creating a Job"
        primaryText="Create Job"
        secondaryText="Cancel"
        onPrimary={() => {
          onCreateJob(jobDetails);
          closeOverlay();
        }}
        disabledPrimary={
          selectedChecklist
            ? properties.some(
                (property) => property.mandatory && !jobDetails[property.name],
              )
            : properties.some(
                (property) => property.mandatory && !jobDetails[property.name],
              ) || !searchQuery
        }
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
              placeHolder="Search Checklist By Code"
              label="Select a Checklist"
              value={searchQuery}
              id="checklistId"
              executeOnFocus={() => setShowChecklists(true)}
              executeOnBlur={() =>
                setTimeout(() => setShowChecklists(false), 200)
              }
              onChange={(id, value) => setSearchQuery(value)}
              required
              isSearch
            />
            {showChecklists && (
              <div className="checklists-wrapper" onScroll={handleOnScroll}>
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
