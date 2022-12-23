import { ImageUploadButton } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { ParameterProps } from '#PrototypeComposer/Activity/types';
import { Media } from '#PrototypeComposer/checklist.types';
import { FileUploadData } from '#utils/globalTypes';
import { getVideoDevices } from '#utils/inputUtils';
import { LinearProgress } from '@material-ui/core';
import { ArrowLeft, ArrowRight, PhotoCamera } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const MediaViewWrapper = styled.div`
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
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

  .media-list {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 16px;

    .icon {
      background-color: #f4f4f4;
      border-radius: 50%;

      :first-of-type {
        margin-right: 8px;
      }

      :last-of-type {
        margin-left: 8px;
      }
    }

    &-item {
      border: 1px solid #eeeeee;
      border-radius: 5px;
      box-sizing: border-box;
      cursor: pointer;
      height: 100px;
      position: relative;
      width: 26%;

      &-img {
        border-radius: 5px;
        height: 100%;
        width: 100%;
      }

      &-name {
        color: #ffffff;
        font-size: 12px;
        left: 8px;
        position: absolute;
        top: 8px;
      }

      :nth-child(3n) {
        margin-right: 0;
      }

      &.active {
        border-color: #1d84ff;
      }
    }
  }
`;

const MediaTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [imagesData, setImagesData] = useState<any>([]);
  const [sliderIndex, setSliderIndex] = useState({ start: 0, end: 3 });
  const [activeMedia, setActiveMedia] = useState<Media | null>(null);
  const dispatch = useDispatch();
  const { setValue } = form;

  const onUploaded = (fileData: FileUploadData) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.TASK_MEDIA,
        props: {
          mediaDetails: fileData,
          isParameter: true,
          execute: (_data) => {
            setImagesData((prev) => [...prev, _data]);
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

  useEffect(() => {
    if (imagesData) {
      setValue(
        `data.${parameter.id}`,
        {
          ...parameter,
          data: {
            ...parameter.data,
            medias: [...imagesData],
          },
          response: {
            value: null,
            reason: '',
            state: 'EXECUTED',
            choices: {},
            medias: [],
            parameterValueApprovalDto: null,
          },
        },
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }
  }, [imagesData]);

  return (
    <MediaViewWrapper>
      <div style={{ display: 'flex', marginTop: '24px' }}>
        {isUploading ? (
          <LinearProgress style={{ height: 8, width: '100%', color: '#1d84ff' }} />
        ) : (
          <>
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
          </>
        )}
      </div>
      {imagesData.length !== 0 && (
        <div className="media-list">
          <ArrowLeft
            className="icon"
            onClick={() => {
              if (sliderIndex.start > 0) {
                setSliderIndex({
                  start: sliderIndex.start - 1,
                  end: sliderIndex.end - 1,
                });
              }
            }}
          />

          {imagesData.slice(sliderIndex.start, sliderIndex.end).map((media, index) => (
            <div
              className={`media-list-item ${
                media.filename === activeMedia?.filename ? 'active' : ''
              }`}
              key={index}
              onClick={() => setActiveMedia(media)}
              style={{
                background: `url(${media.link}) center/cover no-repeat`,
              }}
            >
              <div className="media-list-item-name">{media.name}</div>
            </div>
          ))}

          <ArrowRight
            className="icon"
            onClick={() => {
              if (sliderIndex.end < imagesData.length) {
                setSliderIndex({
                  start: sliderIndex.start + 1,
                  end: sliderIndex.end + 1,
                });
              }
            }}
          />
        </div>
      )}
    </MediaViewWrapper>
  );
};

export default MediaTaskView;
