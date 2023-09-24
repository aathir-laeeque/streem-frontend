import { TaskMediasWrapper } from '#PrototypeComposer/Tasks/styles';
import { FileGallery, ImageUploadButton } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { FileUploadData, ResponseError } from '#utils/globalTypes';
import { getVideoDevices } from '#utils/inputUtils';
import { getErrorMsg } from '#utils/request';
import { jobActions } from '#views/Job/jobStore';
import { LinearProgress } from '@material-ui/core';
import { PublishOutlined } from '@material-ui/icons';
import { isEqual } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ParameterProps } from './Parameter';

const FileUploadMedias: FC<any> = ({ medias, parameter, isCorrectingError }) => {
  return (
    <TaskMediasWrapper>
      <div className="container">
        <FileGallery medias={medias} parameter={parameter} isCorrectingError={isCorrectingError} />
      </div>
    </TaskMediasWrapper>
  );
};

const FileUploadWrapper = styled.div.attrs({
  className: 'parameter-file',
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

const FileUploadParameter: FC<ParameterProps> = ({
  parameter,
  isCorrectingError,
  isTaskCompleted,
  isLoggedInUserAssigned,
}) => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const [uploadedMedia, setUploadedMedia] = useState([]);

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
            // dispatch(
            //   updateExecutedParameter({
            //     ...parameter,
            //     response: {
            //       ...parameter.response,
            //       medias: [...(parameter.response?.medias ?? []), data],
            //       audit: undefined,
            //       state: 'EXECUTED',
            //     },
            //   }),
            // );
            if (isCorrectingError) {
              dispatch(
                jobActions.fixParameter({
                  parameter: {
                    ...parameter,
                    data: {
                      medias: [...(parameter.data?.medias ?? []), { ...data }],
                    },
                  },
                }),
              );
            } else {
              dispatch(
                jobActions.executeParameter({
                  parameter: {
                    ...parameter,
                    data: {
                      medias: [...(parameter.data?.medias ?? []), { ...data }],
                    },
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

  const onUploadError = (error: string | ResponseError[]) => {
    console.log('error :: ', error);
    let errorMsg = error;
    setIsUploading(false);
    if (error?.length > 0) {
      errorMsg = getErrorMsg(error);
    }
    dispatch(
      showNotification({
        type: NotificationType.ERROR,
        msg: typeof errorMsg === 'string' ? errorMsg : 'Oops! Please Try Again.',
      }),
    );
  };

  const fetchVideoDevices = async () => {
    const devices = await getVideoDevices();
    setVideoDevices(devices);
  };

  useEffect(() => {
    fetchVideoDevices();
  }, []);

  useEffect(() => {
    if (
      parameter?.response?.medias?.length > 0 &&
      !isEqual(parameter?.response?.medias, uploadedMedia)
    ) {
      setUploadedMedia(parameter?.response?.medias);
    }
  }, [parameter?.response?.medias]);

  return (
    <FileUploadWrapper>
      {uploadedMedia.length > 0 && (
        <FileUploadMedias
          medias={uploadedMedia}
          parameter={parameter}
          isCorrectingError={isCorrectingError}
        />
      )}
      {(!isTaskCompleted || isCorrectingError) && (
        <div style={{ display: 'flex' }}>
          {isUploading ? (
            <LinearProgress style={{ height: 8, width: '100%', color: '#1d84ff' }} />
          ) : (
            <>
              <div className="card">
                <ImageUploadButton
                  label="Click Here To Upload Files"
                  onUploadStart={onUploadStart}
                  onUploadSuccess={(fileData) => {
                    onUploaded(fileData);
                  }}
                  icon={PublishOutlined}
                  onUploadError={onUploadError}
                  acceptedTypes={['image/*', '.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']}
                />
              </div>
            </>
          )}
        </div>
      )}
    </FileUploadWrapper>
  );
};

export default FileUploadParameter;
