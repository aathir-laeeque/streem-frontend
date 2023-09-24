import React, { FC } from 'react';
import styled from 'styled-components';

const ImageGalleryWrapper = styled.div.attrs({
  className: 'image-gallery-wrapper',
})`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .media-list {
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    overflow: auto;
    padding: 4px;

    &-item {
      border: 1px solid #eeeeee;
      border-radius: 4px;
      box-sizing: border-box;
      cursor: pointer;
      height: 100px;
      position: relative;
      min-width: 100px;

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
    }

    ::-webkit-scrollbar {
      height: 7px;
    }
  }
`;

type ImageGalleryProps = {
  medias: ImagesType[];
  onClickHandler: (media: ImagesType) => void;
};

type ImagesType = {
  archived: boolean;
  description: string | null;
  filename: string;
  mediaId: string;
  link: string;
  name: string;
  originalFilename: string;
  type: string;
};

export const ImageGallery: FC<ImageGalleryProps> = ({ medias, onClickHandler }) => {
  return (
    <ImageGalleryWrapper>
      <div className="media-list">
        {medias.map((media, index) => {
          if (media?.archived === false) {
            return (
              <div
                className="media-list-item"
                key={index}
                onClick={() => onClickHandler(media)}
                style={{
                  background: `url(${media.link}) center/cover no-repeat`,
                }}
              >
                <div className="media-list-item-name">{media.name}</div>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </ImageGalleryWrapper>
  );
};
