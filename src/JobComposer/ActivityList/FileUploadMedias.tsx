import { FileGallery, FileGalleryProps } from '#components';
import { TaskMediasWrapper } from '#PrototypeComposer/Tasks/styles';
import React, { FC } from 'react';

const FileUploadMedias: FC<FileGalleryProps> = ({
  medias,
  parameter,
  isCorrectingError,
  isTaskCompleted,
}) => {
  return (
    <TaskMediasWrapper>
      <div className="container">
        <FileGallery
          medias={medias}
          parameter={parameter}
          isCorrectingError={isCorrectingError}
          isTaskCompleted={isTaskCompleted}
        />
      </div>
    </TaskMediasWrapper>
  );
};

export default FileUploadMedias;
