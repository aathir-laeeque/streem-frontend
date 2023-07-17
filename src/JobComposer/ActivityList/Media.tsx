import { ImageUploadButton } from '#components';
import { OverlayNames } from '#components/OverlayContainer/types';
import TaskMedias from '#PrototypeComposer/Tasks/TaskMedias';
import { FileUploadData } from '#utils/globalTypes';
import { getVideoDevices } from '#utils/inputUtils';
import { LinearProgress } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { openOverlayAction } from '../../components/OverlayContainer/actions';
import { executeParameter, fixParameter, updateExecutedParameter } from './actions';
import { ParameterProps } from './types';
import { useTypedSelector } from '#store';

const MediaWrapper = styled.div.attrs({
  className: 'parameter-media',
})`
  display: flex;
  flex-direction: column;

  .card {
    align-items: center;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
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

const MediaParameter: FC<ParameterProps> = ({
  parameter,
  isCorrectingError,
  isTaskCompleted,
  isLoggedInUserAssigned,
}) => {
  const dispatch = useDispatch();

  const {
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.composer);

  const [isUploading, setIsUploading] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

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
          isParameter: true,
          execute: (data) => {
            dispatch(
              updateExecutedParameter({
                ...parameter,
                response: {
                  ...parameter.response,
                  medias: [...(parameter.response?.medias ?? []), data],
                  audit: undefined,
                  state: 'EXECUTED',
                },
              }),
            );
            if (isCorrectingError) {
              dispatch(
                fixParameter({
                  ...parameter,
                  data: {
                    medias: [...(parameter.data?.medias ?? []), { ...data }],
                  },
                }),
              );
            } else {
              dispatch(
                executeParameter({
                  ...parameter,
                  data: {
                    medias: [...(parameter.data?.medias ?? []), { ...data }],
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

  const fetchVideoDevices = async () => {
    const devices = await getVideoDevices();
    setVideoDevices(devices);
  };

  useEffect(() => {
    fetchVideoDevices();
  }, []);

  return (
    <MediaWrapper data-id={parameter.id} data-type={parameter.type}>
      {parameter.response?.medias?.length > 0 && (
        <TaskMedias
          taskId={activeTaskId}
          medias={parameter.response?.medias ?? []}
          parameterId={parameter.id}
          isTaskCompleted={isTaskCompleted || !isLoggedInUserAssigned}
          isParameter
        />
      )}
      {!isTaskCompleted && (
        <div style={{ display: 'flex' }}>
          {isUploading ? (
            <LinearProgress style={{ height: 8, width: '100%', color: '#1d84ff' }} />
          ) : (
            <div
              className="card"
              style={videoDevices.length === 0 ? { cursor: 'not-allowed' } : {}}
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
                disabled={videoDevices.length === 0}
                onUploadError={onUploadError}
              />
            </div>
          )}
        </div>
      )}
    </MediaWrapper>
  );
};

export default MediaParameter;
