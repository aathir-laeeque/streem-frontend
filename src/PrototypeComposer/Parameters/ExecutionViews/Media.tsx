import { ImageUploadButton } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { FileUploadData } from '#utils/globalTypes';
import { getVideoDevices } from '#utils/inputUtils';
import { LinearProgress } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import React, { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const MediaViewWrapper = styled.div`
  align-items: center;
  background-color: #f4f4f4;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 16px;
  gap: 8px;

  .icon {
    color: #1d84ff;
  }

  span {
    font-size: 14px;
    line-height: 1.14;
    letter-spacing: 0.16px;
    color: #1d84ff;
  }
`;

const MediaTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const { register, watch, setValue } = form;
  const data = watch('data', {});

  register('data', {
    required: true,
  });

  console.log(parameter, 'zero execution');

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
          execute: (value) => {
            console.log(value, 'zero execution check');
            setValue(
              'data',
              {
                ...data,
                [parameter.id]: {
                  value: null,
                  reason: null,
                  state: 'EXECUTED',
                  choices: {},
                  medias: [value],
                  parameterValueApprovalDto: null,
                },
              },
              {
                shouldDirty: true,
                shouldValidate: true,
              },
            );

            // dispatch(
            //   updateExecutedParameter({
            //     ...parameter,
            //     response: {
            //       ...parameter.response,
            //       medias: [...(parameter.response?.medias ?? []), { ...data }],
            //       audit: undefined,
            //       state: 'EXECUTED',
            //     },
            //   }),
            // );
            // if (isCorrectingError) {
            //   dispatch(
            //     fixParameter({
            //       ...parameter,
            //       data: {
            //         medias: [...(parameter.data?.medias ?? []), { ...data }],
            //       },
            //     }),
            //   );
            // } else {
            // below dispatch was here
            // }
            // dispatch(
            //   executeParameter({
            //     ...parameter,
            //     response: {
            //       ...parameter.response,
            //       medias: [...(parameter.response?.medias ?? []), { ...data }],
            //       audit: undefined,
            //       state: 'EXECUTED',
            //     },
            //   }),
            // );
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
    <MediaViewWrapper>
      <div style={{ display: 'flex', marginTop: '24px' }}>
        {isUploading ? (
          <LinearProgress style={{ height: 8, width: '100%', color: '#1d84ff' }} />
        ) : (
          <div className="card" style={videoDevices.length === 0 ? { cursor: 'not-allowed' } : {}}>
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
    </MediaViewWrapper>
  );
};

export default MediaTaskView;
