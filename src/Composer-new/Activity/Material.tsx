import { AddNewItem, TextInput } from '#components';
import { resetFileUpload, uploadFile } from '#store/file-upload/actions';
import { useTypedSelector } from '#store/helpers';
import {
  AddAPhoto,
  ArrowDropDown,
  ArrowDropUp,
  Close,
} from '@material-ui/icons';
import { debounce } from 'lodash';
import React, { createRef, FC, RefObject, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateActivity } from './actions';
import { MaterialWrapper } from './styles';
import { ActivityProps } from './types';

const MaterialActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: uploadedFile } = useTypedSelector((state) => state.fileUpload);

  const dispatch = useDispatch();

  const fileRefMap: Record<string, RefObject<HTMLInputElement>> = {};

  useEffect(() => {
    if (selectedFile) {
      dispatch(resetFileUpload());

      const formData = new FormData();
      formData.append('file', selectedFile, selectedFile.name);

      dispatch(uploadFile({ formData }));
    }
  }, [selectedFile]);

  useEffect(() => {
    if (uploadedFile) {
      console.log('do what you want with uploaded file');
    }
  }, [uploadedFile]);

  return (
    <MaterialWrapper>
      <label>Add Materials</label>

      <ol className="material-list">
        {activity.data?.map((item, index: number) => {
          if (!item.link) {
            fileRefMap[index.toString()] = createRef();
          }

          return (
            <li className="material-list-item" key={index}>
              <div className={`image-wrapper ${item.link ? '' : 'default'}`}>
                {item.link ? (
                  <img src={item.link} className="image" />
                ) : (
                  <>
                    <input
                      type="file"
                      id="file"
                      ref={fileRefMap[index.toString()]}
                      style={{ display: 'none' }}
                      onChange={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        setSelectedFile((event.target?.files ?? [])[0]);
                      }}
                    />
                    <AddAPhoto
                      className="icon"
                      fontSize="large"
                      onClick={() => {
                        fileRefMap[index.toString()].current?.click();
                      }}
                    />
                  </>
                )}
              </div>

              <TextInput
                className="item-input"
                defaultValue={item.name}
                onChange={debounce(({ value }) => {
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
                }, 500)}
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
                    if (item.quantity >= 0) {
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
