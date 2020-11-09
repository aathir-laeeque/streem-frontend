import { BaseModal, ImageUploadButton, Textarea } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { FileUploadData } from '#utils/globalTypes';
import {
  Add,
  Delete,
  RadioButtonChecked,
  RadioButtonUnchecked,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { completeJob } from '../actions';

const Wrapper = styled.div`
  .modal-body {
    max-height: 500px;
    overflow: auto;
  }

  .details {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;

    span {
      color: #666666;
      font-size: 16px;
      line-height: 1;

      :first-child {
        margin-bottom: 16px;
      }

      :last-child {
        color: #333333;
        font-weight: 600;
      }
    }
  }

  .reason {
    &-container {
      label {
        color: #666666;
        display: flex;
        font-size: 16px;
        margin-bottom: 8px;
      }
    }

    &-list {
      display: flex;
      flex-wrap: wrap;
    }

    &-item {
      align-content: center;
      box-sizing: bordr-box;
      color: #666666;
      cursor: pointer;
      display: flex;
      flex: 0 50%;
      font-size: 16px;
      margin-bottom: 8px;

      > .icon {
        margin-right: 5px;

        &.selected {
          color: #1d84ff;
        }
      }

      span {
        align-items: center;
        display: flex;
      }
    }
  }

  .textarea {
    margin-top: 8px;
  }

  .media-upload {
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    .header {
      align-items: center;
      display: flex;
      justify-content: space-between;

      .upload-image {
        > div {
          color: #1d84ff;

          .icon {
            color: #1d84ff;
          }
        }
      }
    }

    .body {
      counter-reset: item;
      list-style-type: none;
      padding: 0;

      .item {
        display: flex;
        align-items: center;
        list-style-position: inside;

        :before {
          color: #000000;
          content: counter(item) ' ';
          counter-increment: item;
          font-size: 14px;
          margin-right: 12px;
        }

        .remove {
          align-items: center;
          color: #ff6b6b;
          display: flex;
          margin-left: auto;

          .icon {
            color: #ff6b6b;
            margin-right: 5px;
          }
        }
      }
    }
  }
`;

const ExceptionReason = [
  { label: 'Job got cancelled', value: 'JOB_GOT_CANCELLED' },
  { label: 'Job created by mistake', value: 'JOB_CREATED_BY_MISTAKE' },
  { label: 'Job completed offline', value: 'JOB_COMPLETED_OFFLINE' },
  { label: 'Other', value: 'OTHER' },
];

export type ExceptionValues = {
  comment: string;
  medias: FileUploadData[];
  reason: string;
};

const CompleteJobWithExceptionModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { jobId, name, code },
}) => {
  const dispatch = useDispatch();

  const [values, setValues] = useState<ExceptionValues>({
    comment: '',
    medias: [],
    reason: '',
  });

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        onPrimary={() => {
          console.log('values :: ', values);
          dispatch(
            completeJob({
              jobId,
              withException: true,
              values,
              details: { name, code },
            }),
          );
        }}
        onSecondary={() => closeOverlay()}
        primaryText="Complete Job"
        secondaryText="Go Back"
        title="Completing a Job With Exceptions"
      >
        <div className="details">
          <span>
            You’re about to complete the following job with exceptions:
          </span>
          <span>
            {code} {name}
          </span>
        </div>

        <div className="reason-container">
          <label>Please select a reason below:</label>

          <div className="reason-list">
            {ExceptionReason.map((reason, idx) => (
              <div
                className="reason-item"
                key={idx}
                onClick={() =>
                  setValues((val) => ({ ...val, reason: reason.value }))
                }
              >
                {values.reason === reason.value ? (
                  <RadioButtonChecked className="icon selected" />
                ) : (
                  <RadioButtonUnchecked className="icon" />
                )}
                <span>{reason.label}</span>
              </div>
            ))}
          </div>
        </div>

        <Textarea
          defaultValue={values.comment}
          label="Additional Remarks"
          onChange={debounce(({ value }) => {
            setValues((val) => ({ ...val, comment: value }));
          }, 500)}
          rows={3}
        />

        <div className="media-upload">
          <div className="header">
            <label>Document Upload</label>
            <ImageUploadButton
              icon={Add}
              label="Add New File"
              onUploadError={(error) =>
                console.log('error on media upload :: ', error)
              }
              onUploadSuccess={(file) => {
                console.log('file on upload :: ', file);
                setValues((val) => ({ ...val, medias: [...val.medias, file] }));
              }}
            />
          </div>

          <ol className="body">
            {values.medias.map((media, index) => (
              <li className="item" key={index}>
                <div>{media.filename}</div>
                <div className="remove">
                  <Delete className="icon" />
                  Delete
                </div>
              </li>
            ))}
          </ol>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default CompleteJobWithExceptionModal;
