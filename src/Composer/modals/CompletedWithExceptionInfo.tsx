import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC } from 'react';
import styled from 'styled-components';
import { GetAppOutlined } from '@material-ui/icons';

const Wrapper = styled.div`
  .modal-body {
    max-height: 500px;
    overflow: auto;

    > div {
      :last-child {
        margin-bottom: 0;
      }
    }
  }

  .details,
  .reason,
  .media {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;

    > label {
      font-size: 16px;
      font-weight: normal;
      color: #666666;
      margin-bottom: 16px;
    }

    > div {
      display: flex;

      > span {
        font-size: 16px;
        font-weight: 600;
        color: #000000;

        :first-child {
          margin-right: 8px;
        }
      }
    }
  }

  .media {
    .body {
      counter-reset: item;
      list-style-type: none;
      padding: 0;
      margin: 0;
      width: 100%;

      .item {
        display: flex;
        align-items: center;
        list-style-position: inside;

        :before {
          color: #000000;
          content: counter(item) '. ';
          counter-increment: item;
          font-size: 14px;
          margin-right: 12px;
        }

        .download {
          align-items: center;
          color: #1d84ff;
          display: flex;
          margin-left: auto;
          cursor: pointer;

          .icon {
            color: #1d84ff;
            margin-right: 5px;
          }
        }
      }
    }
  }
`;

const ExceptionReason = [
  { label: 'Job got cancelled', value: 'job_got_cancelled' },
  { label: 'Job created by mistake', value: 'job_created_by_mistake' },
  { label: 'Job completed offline', value: 'job_completed_offline' },
  { label: 'Other', value: 'other' },
];

const CompleteJobWithExceptionModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { jobCweDetail, name, code },
}) => {
  const reason = ExceptionReason.find(
    (reason) => reason.value === jobCweDetail?.reason,
  );

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        onPrimary={closeOverlay}
        primaryText="Done"
        title="Viewing a Job With Exceptions"
        showSecondary={false}
      >
        <div className="details">
          <label>You’re viewing the following job with exceptions :</label>
          <div>
            <span>{code}</span>
            <span>{name}</span>
          </div>
        </div>

        <div className="reason">
          <label>Reason Provided :</label>
          <div>
            <span>
              {reason?.label}
              {jobCweDetail?.comment ? ` - ${jobCweDetail?.comment}` : ''}
            </span>
          </div>
        </div>

        {jobCweDetail?.medias?.length ? (
          <div className="media">
            <label>Documents :</label>
            <ol className="body">
              {jobCweDetail?.medias?.map((media, index) => (
                <li key={index} className="item">
                  <div>{media.filename}</div>
                  <div
                    className="download"
                    onClick={() => window.open(media.link, '_blank')}
                  >
                    <GetAppOutlined className="icon" />
                    Download
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </BaseModal>
    </Wrapper>
  );
};

export default CompleteJobWithExceptionModal;
