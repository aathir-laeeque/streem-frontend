import { Delete, MoreVertOutlined, Publish } from '@material-ui/icons';
import React, { FC, useState } from 'react';

import { InteractionViewProps } from '../InteractionsView/types';
import { Wrapper } from './styles';

const MediaInteraction: FC<InteractionViewProps> = ({ interaction }) => {
  console.log('interaction from MediaInteraction :: ', interaction);
  const [activeMedia, setActiveMedia] = useState(interaction.data[0]);

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
        {interaction.data.map((el, index) => (
          <div
            className="media-interaction-media-item"
            key={index}
            onClick={() => setActiveMedia(el)}
          >
            <img src={el.link} />
            <div>
              <span>{el.name}</span>
              <MoreVertOutlined className="icon" />
            </div>
          </div>
        ))}
        <div className="upload-button">
          <Publish className="icon" style={{ color: '#12aab3' }} />
        </div>
      </div>
    </Wrapper>
  );
};

export default MediaInteraction;
