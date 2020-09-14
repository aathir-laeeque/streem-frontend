import { Entity } from '#Composer/composer.types';
import { useTypedSelector } from '#store';
import { ImageOutlined } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { openModalAction } from '../../../components/ModalContainer/actions';
import { ModalNames } from '../../../components/ModalContainer/types';
import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const YesNoActivity: FC<ActivityProps> = ({ activity }) => {
  const dispatch = useDispatch();

  const { entity } = useTypedSelector((state) => state.composer);

  return (
    <Wrapper>
      {entity === Entity.JOB ? (
        <ol className="list-container">
          {activity.data.map((el, index) => (
            <li className="list-item" key={index}>
              {el.link ? (
                <img
                  src={el.link}
                  className="list-item-image"
                  onClick={() =>
                    dispatch(
                      openModalAction({
                        type: ModalNames.MEDIA_DETAIL,
                        props: { mediaDetails: el },
                      }),
                    )
                  }
                />
              ) : (
                <div className="list-item-image">
                  <ImageOutlined className="icon" />
                </div>
              )}

              <span className="name">{el.name}</span>

              <div className="list-item-quantity">
                <span className="quantity">
                  {el.quantity === 0
                    ? null
                    : el.quantity.toString().padStart(2, '0')}
                </span>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </Wrapper>
  );
};

export default YesNoActivity;
