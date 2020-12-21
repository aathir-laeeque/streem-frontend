import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .container {
    display: flex;
    height: 400px;
    width: 600px;
    padding: 16px;

    .image {
      width: 66%;
      border-right: 1px solid #eeeeee;

      img {
        height: 100%;
        width: 100%;
      }
    }

    .details {
      width: 34%;
    }
  }
`;

const MediaDetailModal: FC<CommonOverlayProps<{ mediaDetails: any }>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { mediaDetails },
}) => {
  console.log('mediaDetailss :: ', mediaDetails);
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="container">
          <div className="image">
            <img src={mediaDetails.link} />
          </div>

          <div className="details">{mediaDetails.name}</div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default MediaDetailModal;
