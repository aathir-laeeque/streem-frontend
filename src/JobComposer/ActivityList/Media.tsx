import { ImageUploadButton } from '#components';
import { OverlayNames } from '#components/OverlayContainer/types';
import { FileUploadData } from '#utils/globalTypes';
import { captureSupported } from '#utils/inputUtils';
import TaskMedias from '#PrototypeComposer/Tasks/TaskMedias';
import { PhotoCamera } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { openOverlayAction } from '../../components/OverlayContainer/actions';
import { executeActivity, fixActivity } from './actions';
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
  };
  return (
    <MediaWrapper>
      <TaskMedias
        medias={activity.response?.medias ?? []}
        activityId={activity.id}
        isActivity
      />
      <div style={{ display: 'flex', marginTop: '24px' }}>
        <div className="card">
          <ImageUploadButton
            label="Upload images"
            onUploadSuccess={(fileData) => {
              console.log('fileData :: ', fileData);
              onUploaded(fileData);
            }}
            onUploadError={(error) => console.log('error :: ', error)}
          />
        </div>
        <div
          className="card"
          style={!captureSupported() ? { cursor: 'not-allowed' } : {}}
        >
          <ImageUploadButton
            label="User can capture photos"
            onUploadSuccess={(fileData) => {
              console.log('fileData :: ', fileData);
              onUploaded(fileData);
            }}
            icon={PhotoCamera}
            allowCapture
            disabled={!captureSupported()}
            onUploadError={(error) => console.log('error :: ', error)}
          />
        </div>
      </div>
    </MediaWrapper>
  );
};

export default MediaActivity;
