import { AddNewItem } from '#components';
import { useTypedSelector } from '#store';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import React, { FC } from 'react';
import {
  ArrowDropDown,
  ArrowDropUp,
  Close,
  ImageOutlined,
} from '@material-ui/icons';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const MaterialActivity: FC<ActivityProps> = ({ activity }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);

  const isEditing = composerState === ComposerState.EDIT;

  return (
    <Wrapper isEditing={isEditing}>
      <div className="header">Add Materials</div>

      <ol className="list-container">
        {activity.data.map((el, index) => (
          <li className="list-item" key={index}>
            {el.link ? (
              <img src={el.link} className="list-item-image" />
            ) : (
              <div className="list-item-image">
                <ImageOutlined className="icon" />
              </div>
            )}

            {isEditing ? (
              <input
                className="new-form-field-input"
                value={el.name}
                type="text"
                placeholder="Type here..."
                onChange={(e) => {}}
              />
            ) : (
              <span className="name">{el.name}</span>
            )}

            <div className="list-item-quantity">
              <ArrowDropDown
                className={`icon${el.quantity === 0 ? ' disabled' : ''}`}
              />
              <span className="quantity">
                {el.quantity === 0
                  ? isEditing
                    ? 'Any'
                    : null
                  : el.quantity.toString().padStart(2, '0')}
              </span>
              <ArrowDropUp className="icon" />
            </div>

            <Close className="icon" fontSize="small" />
          </li>
        ))}

        {isEditing ? <AddNewItem onClick={() => {}} /> : null}
      </ol>
    </Wrapper>
  );
};

export default MaterialActivity;
