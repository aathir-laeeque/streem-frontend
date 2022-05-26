import { ImageUploadButton } from '#components';
import { OverlayNames } from '#components/OverlayContainer/types';
import TaskMedias from '#PrototypeComposer/Tasks/TaskMedias';
import { FileUploadData } from '#utils/globalTypes';
import { captureSupported } from '#utils/inputUtils';
import { LinearProgress } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { openOverlayAction } from '../../components/OverlayContainer/actions';
import {
  executeActivity,
  fixActivity,
  updateExecutedActivity,
} from './actions';
import { ActivityProps } from './types';

const MediaWrapper = styled.div.attrs({
  className: 'activity-media',
})`
  display: flex;
  flex-direction: column;

  .card {
    align-items: center;
    background-color: #f4f4f4;
    border: 1px solid #1d84ff;
    border-radius: 4px;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin-right: 24px;
    padding: 24px;

    :last-child {
      margin-right: 0;
    }

    .icon {
      font-size: 48px;
      cursor: not-allowed;
    }

    span {
      color: #1d84ff;
      font-size: 14px;
      margin-top: 8px;
    }

    .upload-image {
      > div {
        display: flex;
        flex-direction: column;
      }

      .icon {
        cursor: pointer;
      }
    }
  }
`;

const MediaActivity: FC<ActivityProps> = ({ activity, isCorrectingError }) => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);

  const onUploaded = (fileData: FileUploadData) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.TASK_MEDIA,
        props: {
          mediaDetails: {
            ...fileData,
            name: '',
            description: '',
          },
          isActivity: true,
          execute: (data) => {
            dispatch(
              updateExecutedActivity({
                ...activity,
                response: {
                  ...activity.response,
                  medias: [...(activity.response?.medias ?? []), data],
                  audit: undefined,
                  state: 'EXECUTED',
                },
              }),
            );
            if (isCorrectingError) {
              dispatch(
                fixActivity({
                  ...activity,
                  data: {
                    medias: [...(activity.data?.medias ?? []), { ...data }],
                  },
                }),
              );
            } else {
              dispatch(
                executeActivity({
                  ...activity,
                  data: {
                    medias: [...(activity.data?.medias ?? []), { ...data }],
                  },
                }),
              );
            }
          },
        },
      }),
    );
    setIsUploading(false);
  };

  const onUploadStart = () => setIsUploading(true);

  const onUploadError = (error: string) => {
    console.log('error :: ', error);
    setIsUploading(false);
  };

  return (
    <MediaWrapper>
      <TaskMedias
        medias={activity.response?.medias ?? []}
        activityId={activity.id}
        isActivity
      />
      <div style={{ display: 'flex', marginTop: '24px' }}>
        {isUploading ? (
          <LinearProgress
            style={{ height: 8, width: '100%', color: '#1d84ff' }}
          />
        ) : (
          <>
            <div className="card">
              <ImageUploadButton
                label="Upload images"
                onUploadStart={onUploadStart}
                onUploadSuccess={(fileData) => {
                  console.log('fileData :: ', fileData);
                  onUploaded(fileData);
                }}
                onUploadError={onUploadError}
              />
            </div>
            <div
              className="card"
              style={!captureSupported() ? { cursor: 'not-allowed' } : {}}
            >
              <ImageUploadButton
                label="User can capture photos"
                onUploadStart={onUploadStart}
                onUploadSuccess={(fileData) => {
                  console.log('fileData :: ', fileData);
                  onUploaded(fileData);
                }}
                icon={PhotoCamera}
                allowCapture
                disabled={!captureSupported()}
                onUploadError={onUploadError}
              />
            </div>
          </>
        )}
      </div>
    </MediaWrapper>
  );
};

export default MediaActivity;
