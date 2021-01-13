import ImageUploadIcon from '#assets/svg/ImageUpload';
import { ActivityItemInput, AddNewItem, ImageUploadButton } from '#components';
import { ArrowDropDown, ArrowDropUp, Close } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { updateActivity } from './actions';
import { MaterialWrapper } from './styles';
import { ActivityProps } from './types';

const MaterialActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  const activityError = activity.errors.find((error) => error.code === 'E419');

  return (
    <MaterialWrapper>
      <label>Add Materials</label>

      <ol className="material-list">
        {activity.data?.map((item, index: number) => {
          return (
            <li className="material-list-item" key={item.id}>
              <div className={`image-wrapper ${item.link ? '' : 'default'}`}>
                {item.link ? (
                  <img src={item.link} className="image" />
                ) : (
                  <ImageUploadButton
                    icon={ImageUploadIcon}
                    onUploadSuccess={(fileData) => {
                      console.log('fileData on uploadSuccess :: ', fileData);
                      dispatch(
                        updateActivity({
                          ...activity,
                          data: [
                            ...activity.data.slice(0, index),
                            { ...item, ...fileData },
                            ...activity.data.slice(index + 1),
                          ],
                        }),
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
          );
        })}

        {activityError ? (
          <div className="activity-error">{activityError?.message}</div>
        ) : null}

        <AddNewItem
          onClick={() =>
            dispatch(
              updateActivity({
                ...activity,
                data: [
                  ...activity.data,
                  {
                    link: '',
                    name: '',
                    type: 'image',
                    fileName: '',
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
