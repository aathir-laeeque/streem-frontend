import {
  BaseModal,
  AutoComplete,
  TextInput,
  Button1,
  fetchDataParams,
} from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { Property } from '#store/properties/types';
import { Checklist } from '#views/Checklists/types';
import { useDispatch } from 'react-redux';
import { fetchChecklists } from '#views/Checklists/ListView/actions';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { capitalize } from 'lodash';

export interface CreateJobModalProps {
  selectedChecklist: Checklist | null;
  properties: Property[];
  onCreateJob: (jobDetails: Record<string, string>) => void;
}

const Wrapper = styled.div.attrs({})`
  .modal {
    min-width: 500px !important;
    max-width: 720px !important;

    .modal-header {
      padding: 24px !important;
      border-bottom: 1px solid #eeeeee;

      h2 {
        color: #000 !important;
        font-weight: bold !important;
      }
    }

    .modal-body {
      padding: 24px !important;

      .properties-container {
        display: flex;
        flex-wrap: wrap;

        .row {
          margin-top: 24px;

          :nth-child(2n) {
            margin-left: 24px;
          }
        }

        &.vertical {
          flex-direction: column;

          .row {
            :nth-child(2n) {
              margin-left: 0;
            }
          }
        }
      }

      .input-label {
        font-size: 12px;
        text-transform: capitalize;

        .optional-badge {
          margin-left: auto;
        }
      }

      .field-error {
        margin-top: 4px;
        font-size: 12px;
      }

      .buttons-container {
        display: flex;
        margin-top: 40px;
      }
    }

    .modal-footer {
      padding: 24px !important;
    }
  }
`;

export const CreateJobModal: FC<CommonOverlayProps<CreateJobModalProps>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { properties, onCreateJob, selectedChecklist },
}) => {
  const { checklists, pageable, loading } = useTypedSelector(
    (state) => state.checklistListView,
  );
  const dispatch = useDispatch();

  const fetchData = ({
    page,
    isReseting = true,
    size = 10,
    query = '',
  }: fetchDataParams) => {
    const filters = JSON.stringify({
      op: 'AND',
      fields: [
        { field: 'code', op: 'LIKE', values: [query] },
        { field: 'state', op: 'EQ', values: ['PUBLISHED'] },
        { field: 'archived', op: 'EQ', values: [false] },
      ],
    });
    dispatch(fetchChecklists({ page, size, filters, sort: 'id' }, isReseting));
  };

  const { control, handleSubmit, register, errors, formState } = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const onSubmit = (data: Record<string, string>) => {
    onCreateJob(data);
    closeOverlay();
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Creating a Job"
        showFooter={false}
      >
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          {selectedChecklist ? (
            <>
              <TextInput
                label="Checklist"
                defaultValue={selectedChecklist.name}
                disabled
              />
              <input
                ref={register({ required: true })}
                value={selectedChecklist.id}
                name="checklistId"
                type="hidden"
              />
            </>
          ) : (
            <AutoComplete
              control={control}
              label="Checklist"
              name="checklistId"
              choices={checklists}
              fetchData={fetchData}
              currentPage={pageable.page}
              lastPage={pageable.last}
              rules={{ required: true }}
              loading={loading}
              getOptionLabel={(option) => `${option.name} - ${option.code}`}
              getOptionSelected={(option, value) => option.id === value.id}
              renderOption={(option) => (
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ color: '#666' }}>{option.name}</span>
                  <span style={{ color: '#999' }}>{option.code}</span>
                </div>
              )}
            />
          )}
          <div
            className={`properties-container ${
              properties.length <= 4 ? 'vertical' : ''
            }`}
          >
            {properties.map((property, index) => (
              <TextInput
                key={`property_${index}`}
                label={property.name.toLowerCase()}
                name={property.name}
                optional={!property.mandatory}
                ref={register({
                  required: property.mandatory
                    ? `${capitalize(property.name)} is required.`
                    : false,
                })}
                className="row"
                error={
                  errors[property.name]?.message !== ''
                    ? errors[property.name]?.message
                    : ''
                }
              />
            ))}
          </div>
          <div className="buttons-container">
            <Button1 variant="secondary" color="red" onClick={closeOverlay}>
              Cancel
            </Button1>
            <Button1
              disabled={!formState.isValid || !formState.isDirty}
              type="submit"
            >
              Create Job
            </Button1>
            <Button1
              disabled={!formState.isValid || !formState.isDirty}
              variant="textOnly"
              style={{ marginLeft: 'auto' }}
            >
              Schedule Job
            </Button1>
          </div>
        </form>
      </BaseModal>
    </Wrapper>
  );
};
