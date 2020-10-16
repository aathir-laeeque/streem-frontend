import { ImageUploadButton } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { ArrowLeft, ArrowRight, PermMedia } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { TaskMediasWrapper } from './styles';
import { TaskMediasProps } from './types';

const TaskMedias: FC<TaskMediasProps> = ({ medias, taskId }) => {
  const dispatch = useDispatch();

  const { activeTaskId } = useTypedSelector(
    (state) => state.prototypeComposer.tasks,
  );

  const [activeMedia, setActiveMedia] = useState(medias[0]);

  const [sliderIndex, setSliderIndex] = useState({ start: 0, end: 3 });

  useEffect(() => {
    if (medias.length) {
      setActiveMedia(medias[0]);
    }
  }, [medias]);

  if (taskId === activeTaskId && medias.length) {
    return (
      <TaskMediasWrapper>
        <div className="container">
          <div
            className="active-media"
            onClick={() => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.TASK_MEDIA,
                  props: {
                    taskId,
                    mediaDetails: { ...activeMedia },
                  },
                }),
              );
            }}
          >
            <img src={activeMedia?.link} />
            <div className="active-media-name">{activeMedia?.name}</div>
          </div>

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

            {medias
              .slice(sliderIndex.start, sliderIndex.end)
              .map((media, index) => (
                <div
                  className={`media-list-item ${
                    media.filename === activeMedia?.filename ? 'active' : ''
                  }`}
                  key={index}
                  onClick={() => setActiveMedia(media)}
                >
                  <img src={media.link} className="media-list-item-img" />
                  <div className="media-list-item-name">{media.name}</div>
                </div>
              ))}

            <ArrowRight
              className="icon"
              onClick={() => {
                if (sliderIndex.end < medias.length) {
                  setSliderIndex({
                    start: sliderIndex.start + 1,
                    end: sliderIndex.end + 1,
                  });
                }
              }}
            />
          </div>

          <ImageUploadButton
            onUploadSuccess={(fileData) => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.TASK_MEDIA,
                  props: {
                    mediaDetails: {
                      ...fileData,
                      name: '',
                      description: '',
                    },
                    taskId: taskId,
                  },
                }),
              );
            }}
            onUploadError={(error) => {
              console.log('handle image upload error :: ', error);
            }}
            label="Upload Media"
            icon={PermMedia}
          />
        </div>
      </TaskMediasWrapper>
    );
  } else {
    return <TaskMediasWrapper />;
  }
};

export default TaskMedias;
