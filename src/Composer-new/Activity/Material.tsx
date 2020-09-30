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

import { MaterialWrapper } from './styles';
import { ActivityProps } from './types';

const MaterialActivity: FC<ActivityProps> = ({ activity }) => {
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
                  console.log('updated value for item :: ', value);
                }, 500)}
              />

              <div className="quantity-control">
                <ArrowDropUp
                  className="icon"
                  onClick={() => {
                    console.log('increase quantity by 1');
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
                      console.log('decrease quantity by 1');
                    } else {
                      console.log('no more decrease allowed');
                    }
                  }}
                />
              </div>

              <Close
                className="icon"
                id="remove-item"
                onClick={() => {
                  console.log('remove item from the list');
                }}
              />
            </li>
          );
        })}

        <AddNewItem onClick={() => console.log('add new item to the list')} />
      </ol>
    </MaterialWrapper>
  );
};

export default MaterialActivity;
