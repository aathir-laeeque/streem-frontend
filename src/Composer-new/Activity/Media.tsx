import ImageUploadIcon from '#assets/svg/ImageUpload';
import { PhotoCamera } from '@material-ui/icons';
import React, { FC } from 'react';

import { MediaWrapper } from './styles';
import { ActivityProps } from './types';

const MediaActivity: FC<Omit<ActivityProps, 'taskId'>> = ({}) => {
  return (
    <MediaWrapper>
      <div className="card">
        <ImageUploadIcon className="icon" />
        <span>User can upload images</span>
      </div>
      <div className="card">
        <PhotoCamera className="icon" />
        <span>User can capture photos</span>
      </div>
    </MediaWrapper>
  );
};

export default MediaActivity;
