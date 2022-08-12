import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { fetchObjectType, resetOntology, setActiveObject } from '#views/Ontology/actions';
import ObjectView from '#views/Ontology/Objects/ObjectView';
import { LoadingContainer } from '#views/Ontology/ObjectTypes/ObjectTypeList';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  .modal-body {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    padding: 0 !important;
    max-height: 90vh;

    form {
      margin: 0;
      max-width: unset;
    }
  }
`;

const AutomationActionModal: FC<
  CommonOverlayProps<{
    objectTypeId: string;
    actionType: string;
    onDone: () => void;
    setLoadingState: (loading: boolean) => void;
  }>
> = ({
  closeAllOverlays,
  closeOverlay,
  props: { objectTypeId, onDone, setLoadingState, actionType },
}) => {
  const dispatch = useDispatch();
  const {
    objectTypes: { active, activeLoading },
    objects: { active: selectedObject },
  } = useTypedSelector((state) => state.ontology);

  useEffect(() => {
    dispatch(setActiveObject());
    if (objectTypeId) {
      dispatch(fetchObjectType(objectTypeId));
    }
    return () => {
      dispatch(resetOntology(['objectTypes', 'activeLoading']));
    };
  }, []);

  const onCloseModal = () => {
    closeOverlay();
    setLoadingState(false);
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={onCloseModal}
        showFooter={false}
        title="Automation Action"
      >
        <LoadingContainer
          loading={activeLoading || !active}
          component={
            <ObjectView
              label="Automation Action"
              values={{
                goBack: false,
                objectTypeId,
                onCancel: onCloseModal,
                onDone,
                id: selectedObject ? selectedObject.id : 'new',
                readOnly: !!selectedObject,
              }}
            />
          }
        />
      </BaseModal>
    </Wrapper>
  );
};

export default AutomationActionModal;
