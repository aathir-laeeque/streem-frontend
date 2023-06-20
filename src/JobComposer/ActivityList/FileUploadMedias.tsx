import { FileGallery } from '#components';
import { TaskMediasWrapper } from '#PrototypeComposer/Tasks/styles';
import React, { FC } from 'react';

const FileUploadMedias: FC<any> = ({ medias, parameter }) => {
  return (
    <TaskMediasWrapper>
      <div className="container">
        <FileGallery medias={medias} parameter={parameter} />
      </div>
    </TaskMediasWrapper>
  );
};

export default FileUploadMedias;