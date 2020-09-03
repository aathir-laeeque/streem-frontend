import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';

import { MediaCardProps } from '../types';

const Wrapper = styled.div.attrs({
  className: 'task-media-card',
})`
  grid-area: task-media-card;

  ${({ isTaskActive }) =>
    !isTaskActive
      ? css`
          visibility: hidden;
        `
      : null}

  .container {
    background-color: #ffffff;
    border: solid 1px #eeeeee;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
    display: flex;
    flex-direction: column;
    padding: 24px;

    .active-media {
      border-radius: 4px;
      border: solid 2px #1d84ff;
      position: relative;
      height: 230px;

      .media-name {
        position: absolute;
        color: #ffffff;
        font-size: 12px;
        top: 32px;
        left: 12px;
        width: 56px;
      }

      img {
        height: inherit;
        width: 100%;
      }
    }

    .media-list {
      display: flex;
      flex-wrap: wrap;

      .media-item {
        border: 1px solid #eeeeee;
        box-sizing: border-box;
        height: 100px;
        margin: 10px 10px 0 0;
        width: calc(1 / 3 * 100% - (1 - 1 / 3) * 10px);
        border-radius: 5px;
        position: relative;

        img {
          height: inherit;
          width: 100%;
          border-radius: 5px;
        }

        .media-name {
          position: absolute;
          top: 8px;
          left: 8px;
          color: #ffffff;
          font-size: 12px;
        }

        :nth-child(3n) {
          margin-right: 0;
        }

        &.active {
          border-color: #1d84ff;
        }
      }
    }
  }
`;

const MediaCard: FC<MediaCardProps> = ({ medias, isTaskActive }) => {
  const [activeMedia, setActiveMedia] = useState(medias[0]);

  return (
    <Wrapper isTaskActive={isTaskActive}>
      {medias.length ? (
        <div className="container">
          {activeMedia ? (
            <div className="active-media">
              <img src={activeMedia.link} alt={activeMedia.filename} />
              <span className="media-name">{activeMedia.name}</span>
            </div>
          ) : null}

          <div className="media-list">
            {medias.map((media, index) => (
              <div
                className={`media-item${
                  activeMedia.id === media.id ? ' active' : ''
                }`}
                key={index}
                onClick={() => setActiveMedia(media)}
              >
                <img src={media.link} alt={media.filename} />
                <span className="media-name">{media.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Wrapper>
  );
};

export default MediaCard;
