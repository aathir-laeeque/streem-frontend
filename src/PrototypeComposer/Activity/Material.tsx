import ImageUploadIcon from '#assets/svg/ImageUpload';
import { ActivityItemInput, AddNewItem, ImageUploadButton } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { MediaDetails } from '#PrototypeComposer/Tasks/types';
import { ArrowDropDown, ArrowDropUp, Close, Error } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { updateActivity } from './actions';
import { MaterialWrapper } from './styles';
import { ActivityProps, MaterialActivityErrors } from './types';

const MaterialActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  const activityErrors = activity.errors.filter(
    (error) => error.code in MaterialActivityErrors,
  );

  const isErrorPresent = !!activityErrors.length;

  const openMediaModal = (mediaDetails, item, index: number) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.TASK_MEDIA,
        props: {
          mediaDetails,
          disableNameInput: true,
          isActivity: true,
          execute: (data: MediaDetails) => {
            dispatch(
              updateActivity({
                ...activity,
                data: [
                  ...activity.data.slice(0, index),
                  { ...item, ...data },
                  ...activity.data.slice(index + 1),
                ],
              }),
            );
          },
        },
      }),
    );
  };

  return (
    <MaterialWrapper hasError={isErrorPresent}>
      {isErrorPresent ? (
        <div className="activity-error top">
          <Error />
          Activity Incomplete
        </div>
      ) : null}
      <label>Add Materials</label>

      <ol className="material-list">
        {activity.data?.map((item, index: number) => (
          <li className="material-list-item" key={item.id}>
            <div className={`image-wrapper ${item.link ? '' : 'default'}`}>
              {item.link ? (
                <img
                  src={item.link}
                  className="image"
                  onClick={() => {
                    openMediaModal(
                      {
                        filename: item.filename,
                        link: item.link,
                        type: item.type,
                        name: item.name,
                        description: item.description,
                      },
                      item,
                      index,
                    );
                  }}
                />
              ) : (
                <ImageUploadButton
                  icon={ImageUploadIcon}
                  onUploadSuccess={(fileData) => {
                    openMediaModal(
                      {
                        ...fileData,
                        name: item.name || '',
                        description: item.description || '',
                      },
                      item,
                      index,
                    );
                  }}
                  onUploadError={(error) =>
                    console.error(
                      'error came in fileupload for material item :: ',
                      error,
                    )
                  }
                />
              )}
            </div>

            <ActivityItemInput
              defaultValue={item.name}
              customOnChange={(value) => {
                dispatch(
                  updateActivity({
                    ...activity,
                    data: [
                      ...activity.data.slice(0, index),
                      { ...item, name: value },
                      ...activity.data.slice(index + 1),
                    ],
                  }),
                );
              }}
              error={isErrorPresent && !item.name}
            />

            <div className="quantity-control">
              <ArrowDropUp
                className="icon"
                onClick={() => {
                  dispatch(
                    updateActivity({
                      ...activity,
                      data: [
                        ...activity.data.slice(0, index),
                        { ...item, quantity: item.quantity + 1 },
                        ...activity.data.slice(index + 1),
                      ],
                    }),
                  );
                }}
              />
              <span>
                {item.quantity === 0
                  ? 'Any'
                  : item.quantity.toString().padStart(2, '0')}
              </span>
              <ArrowDropDown
                className="icon"
                onClick={() => {
                  if (item.quantity > 0) {
                    dispatch(
                      updateActivity({
                        ...activity,
                        data: [
                          ...activity.data.slice(0, index),
                          { ...item, quantity: item.quantity - 1 },
                          ...activity.data.slice(index + 1),
                        ],
                      }),
                    );
                  }
                }}
              />
            </div>

            <Close
              className="icon"
              id="remove-item"
              onClick={() => {
                dispatch(
                  updateActivity({
                    ...activity,
                    data: [
                      ...activity.data.slice(0, index),
                      ...activity.data.slice(index + 1),
                    ],
                  }),
                );
              }}
            />
          </li>
        ))}

        {isErrorPresent ? (
          <div className="activity-error">
            {activityErrors.find((error) => error.code === 'E420')?.message}
          </div>
        ) : null}

        <AddNewItem
          onClick={() =>
            dispatch(
              updateActivity({
                ...activity,
                data: [
                  ...activity.data,
                  {
                    name: '',
                    quantity: 0,
                    id: uuidv4(),
                  },
                ],
              }),
            )
          }
        />
      </ol>
    </MaterialWrapper>
  );
};

export default MaterialActivity;
