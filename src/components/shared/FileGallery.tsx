import React, { FC } from 'react';
import styled from 'styled-components';
import closeIcon from '../../assets/svg/close.svg';
import FileIcon from '../../assets/svg/file.svg';
import { Parameter } from '#JobComposer/checklist.types';
import { useDispatch } from 'react-redux';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { omit } from 'lodash';
import { request } from '#utils/request';
import { jobActions } from '#views/Job/jobStore';

const FileGalleryWrapper = styled.div.attrs({
  className: 'file-gallery-wrapper',
})<Pick<FileGalleryProps, 'isTaskCompleted' | 'isCorrectingError'>>`
  display: flex;
  margin-top: 16px;
  justify-content: space-between;
  align-items: center;
  .media-list {
    display: flex;
    flex-wrap: nowrap;

    flex: 1;
    flex-direction: column;
    gap: 10px;
  }

  .media-list-item {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    align-items: center;

    > div {
      display: flex;
      gap: 8px;
    }
  }

  .media-list-item-img {
    border: 1px solid #eeeeee;
    border-radius: 5px;
    box-sizing: border-box;
    cursor: pointer;
    height: 20px;
    width: 20px;
    fit-content: cover;
  }

  .media-list-item-name {
    color: #1d84ff;
    font-size: 14px;
  }

  .media-list-item-remove-icon {
    pointer-events: ${({ isTaskCompleted, isCorrectingError }) =>
      isTaskCompleted && !isCorrectingError ? 'none' : 'unset'}
`;

export type FileGalleryProps = {
  medias: FilesType[];
  parameter: Parameter;
  isCorrectingError?: boolean;
  isTaskCompleted?: boolean;
};

type FilesType = {
  archived: boolean;
  reason: string;
  description: string | null;
  filename: string;
  mediaId: string;
  link: string;
  name: string;
  originalFilename: string;
  type: string;
};

enum FileTypes {
  PDF = 'application/pdf',
  DOC = 'application/doc',
  DOCX = 'application/docx',
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
}

export const FileGallery: FC<FileGalleryProps> = ({
  medias,
  parameter,
  isCorrectingError,
  isTaskCompleted,
}) => {
  const sectionIcon = (type: string, mediaLink: string) => {
    switch (type) {
      case FileTypes.PDF:
      case FileTypes.DOC:
      case FileTypes.DOCX:
        return <img src={FileIcon} alt="file icon" />;
      case FileTypes.JPEG:
      case FileTypes.JPG:
      case FileTypes.PNG:
        return <img className="media-list-item-img" src={mediaLink} alt="file icon" />;
      default:
        return <img src={FileIcon} alt="file icon" />;
    }
  };

  const dispatch = useDispatch();
  const handleDelete = (
    media: FilesType,
    reason: string,
    setFormErrors: (errors?: Error[]) => void,
  ) => {
    const updatedMedias = (parameter?.response?.medias || [])
      .map((currMedia) =>
        omit(
          {
            ...currMedia,
            mediaId: currMedia?.id,
            ...(currMedia?.id === media?.id && {
              archived: true,
              reason,
            }),
          },
          'id',
        ),
      )
      .filter((media: any) => media.archived === true);
    if (isCorrectingError) {
      dispatch(
        jobActions.fixParameter({ parameter: { ...parameter, data: { medias: updatedMedias } } }),
      );
    } else {
      dispatch(
        jobActions.executeParameter({
          parameter: { ...parameter, data: { medias: updatedMedias } },
        }),
      );
    }
    setFormErrors(undefined);
  };

  const onDownload = async (media) => {
    try {
      const res = await request('GET', media.link, {
        responseType: 'blob',
      });
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement('a');
        const extension = media.filename.split('.').pop();
        link.href = url;
        link.setAttribute('download', media.name + '.' + extension);
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error('error from fetchJobLogsExcel function in JobLogsSaga :: ', error);
    }
  };

  return (
    <FileGalleryWrapper isTaskCompleted={isTaskCompleted} isCorrectingError={isCorrectingError}>
      <div className="media-list">
        {medias.map((media, index) => {
          if (media?.archived === false) {
            return (
              <div className="media-list-item" key={index}>
                <div onClick={() => onDownload(media)}>
                  {sectionIcon(media.type, media.link)}
                  <div className="media-list-item-name">{`${media?.name}.${
                    media?.filename?.split('.')?.[1]
                  }`}</div>
                </div>
                <img
                  src={closeIcon}
                  className="media-list-item-remove-icon"
                  onClick={() => {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.REASON_MODAL,
                        props: {
                          modalTitle: 'Remove File',
                          modalDesc: `Are you sure you want to remove the updated file?`,
                          onSubmitHandler: (
                            reason: string,
                            setFormErrors: (errors?: Error[]) => void,
                          ) => {
                            handleDelete(media, reason, setFormErrors);
                          },
                        },
                      }),
                    );
                  }}
                />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </FileGalleryWrapper>
  );
};
