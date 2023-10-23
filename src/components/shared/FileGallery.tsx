import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { openLinkInNewTab } from '#utils';
import { fileTypeCheck } from '#utils/parameterUtils';
import { jobActions } from '#views/Job/jobStore';
import { omit } from 'lodash';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import closeIcon from '../../assets/svg/close.svg';
import FileIcon from '../../assets/svg/file.svg';
import { CustomTag } from './CustomTag';
import { Parameter } from '#types';
import { Media } from '#PrototypeComposer/checklist.types';

const FileGalleryWrapper = styled.div.attrs({
  className: 'file-gallery-wrapper',
})<Pick<FileGalleryProps, 'isTaskCompleted' | 'isCorrectingError'>>`
  display: flex;
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
  }

  .media-list-item-head {
    display: flex;
    gap: 8px;
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
      isTaskCompleted && !isCorrectingError ? 'none' : 'unset'};
  }
`;

export type FileGalleryProps = {
  medias: Media[];
  parameter: Parameter;
  isCorrectingError?: boolean;
  isTaskCompleted?: boolean;
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

  const { jobFromBE: data } = useTypedSelector((state) => state.job);

  const dispatch = useDispatch();
  const handleDelete = (
    media: Media,
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

  const onClickView = (media: any) => {
    const queryString = new URLSearchParams({ link: media.link }).toString();
    openLinkInNewTab(`/jobs/${data!.id as string}/fileUpload/print?${queryString}`);
  };

  return (
    <FileGalleryWrapper isTaskCompleted={isTaskCompleted} isCorrectingError={isCorrectingError}>
      <div className="media-list">
        {medias.map((media, index) => {
          const mediaType = media?.type?.split('/')[1];
          const isImage = fileTypeCheck(['png', 'jpg', 'jpeg'], mediaType);
          if (media?.archived === false) {
            return (
              <div className="media-list-item" key={index}>
                <CustomTag
                  as={isImage ? 'a' : 'div'}
                  target={isImage ? '_blank' : undefined}
                  href={isImage ? media.link : undefined}
                  onClick={isImage ? undefined : () => onClickView(media)}
                  children={
                    <div className="media-list-item-head">
                      {sectionIcon(media.type, media.link)}
                      <div className="media-list-item-name">{`${media?.name}.${
                        media?.filename?.split('.')?.[1]
                      }`}</div>
                    </div>
                  }
                />
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
