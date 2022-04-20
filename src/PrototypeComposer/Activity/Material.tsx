import ImageUploadIcon from '#assets/svg/ImageUpload';
import { ActivityItemInput, AddNewItem, ImageUploadButton } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { MediaDetails } from '#PrototypeComposer/Tasks/types';
import { ArrowDropDown, ArrowDropUp, Close, Error } from '@material-ui/icons';
import { pick } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  addStoreActivityItem,
  removeStoreActivityItem,
  updateActivityApi,
  updateStoreActivity,
  updateStoreMediaActivity,
} from './actions';
import { MaterialWrapper } from './styles';
import { ActivityProps, MaterialActivityErrors } from './types';

const MaterialActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const dispatch = useDispatch();

  const [componentLoaded, updateComponentLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (componentLoaded) {
      dispatch(updateActivityApi(activity));
    } else if (activity) {
      updateComponentLoaded(true);
    }
  }, [activity]);

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
              updateStoreMediaActivity(activity.id, index, {
                ...pick(item, [
                  'mediaId',
                  'filename',
                  'originalFilename',
                  'link',
                  'type',
                  'description',
                ]),
                ...pick(data, [
                  'mediaId',
                  'filename',
                  'originalFilename',
                  'link',
                  'type',
                  'description',
                ]),
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
                  updateStoreActivity(value, activity.id, [
                    'data',
                    index,
                    'name',
                  ]),
                );
              }}
              error={isErrorPresent && !item.name}
            />

            <div className="quantity-control">
              <ArrowDropUp
                className="icon"
                onClick={() => {
                  dispatch(
                    updateStoreActivity(++item.quantity, activity.id, [
                      'data',
                      index,
                      'quantity',
                    ]),
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
                      updateStoreActivity(--item.quantity, activity.id, [
                        'data',
                        index,
                        'quantity',
                      ]),
                    );
                  }
                }}
              />
            </div>

            <Close
              className="icon"
              id="remove-item"
              onClick={() => {
                dispatch(removeStoreActivityItem(activity.id, item.id));
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
              addStoreActivityItem(activity.id, {
                id: uuidv4(),
                name: '',
                quantity: 0,
              }),
            )
          }
        />
      </ol>
    </MaterialWrapper>
  );
};

export default MaterialActivity;
