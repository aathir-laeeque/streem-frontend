import { BaseModal, TextInput, Button } from '#components';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';

export interface PutCustomViewModalProps {
  onPrimary: (data: any) => void;
}

const Wrapper = styled.div.attrs({})`
  .modal {
    .modal-body {
      padding: 24px !important;
      .buttons-container {
        display: flex;
        flex-direction: row-reverse;
        margin-top: 40px;

        button {
          margin-right: 0;
          margin-left: 16px;
        }
      }
    }
  }
`;

const PutCustomViewModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { onPrimary },
}) => {
  const {
    checklistListView: { customViews },
  } = useTypedSelector((state) => state);
  const form = useForm({
    mode: 'onChange',
    criteriaMode: 'all',
  });

  const {
    handleSubmit,
    register,
    formState: { isDirty, isValid },
  } = form;

  const onSubmit = (data: any) => {
    onPrimary(data);
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Create a new saved view"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            name="label"
            label="View Name"
            ref={register({
              required: true,
            })}
          />
          <div className="buttons-container">
            <Button
              type="submit"
              loading={customViews.loading}
              disabled={customViews.loading || !isDirty || !isValid}
            >
              Save
            </Button>
            <Button variant="secondary" onClick={closeOverlay}>
              Cancel
            </Button>
          </div>
        </form>
      </BaseModal>
    </Wrapper>
  );
};

export default PutCustomViewModal;
