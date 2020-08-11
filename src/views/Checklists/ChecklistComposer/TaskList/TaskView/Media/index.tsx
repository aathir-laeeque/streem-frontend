import { Delete, MoreVertOutlined, Publish } from '@material-ui/icons';
import React, { FC, useState } from 'react';

import { Wrapper } from './styles';
import { StepMediaProps } from './types';

const StepMedia: FC<StepMediaProps> = ({ medias }) => {
  const [activeMedia, setActiveMedia] = useState(medias[0]);

  return (
    <Wrapper>
      <div className="media-interaction-header">
        <Delete className="icon" style={{ color: '#ff6a67' }} />
        Delete All Media
      </div>

      <div className="media-interaction-active-media">
        <img src={activeMedia.link} />
        <span>{activeMedia.name}</span>
      </div>

      <div className="media-interaction-media-container">
        {medias.map((media, index) => (
          <div
            className="media-interaction-media-item"
            key={index}
            onClick={() => setActiveMedia(media)}
            {...(activeMedia === media && {
              style: { borderColor: '#1d84ff' },
            })}
          >
            <img src={media.link} />
            <div>
              <span>{media.name}</span>
              <MoreVertOutlined className="icon" />
            </div>
          </div>
        ))}

        <div className="upload-button">
          <Publish className="icon" style={{ color: '#1d84ff' }} />
        </div>
      </div>
    </Wrapper>
  );
};

export default StepMedia;
