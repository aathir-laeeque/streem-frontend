import React, { FC } from 'react';
import styled from 'styled-components';
import { getInitials } from '#utils/stringUtils';

interface ThumbnailProps {
  id: string;
  status?: string;
  title?: string;
  subTitle?: string;
  refFun?: any;
  disabled?: boolean;
  error?: string;
  source: string | { firstName: string; lastName: string };
}

const Wrapper = styled.div.attrs({})`
  flex: 1;
  display: flex;
  padding: 12px 0px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: solid 1px #979797;
  }

  .thumb {
    border: solid 1px #979797;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #dadada;
    font-size: 28px;
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 16px;
  }

  .custom-file-input {
    color: transparent;
    outline: none;
  }

  .custom-file-input::-webkit-file-upload-button {
    visibility: hidden;
  }

  .custom-file-input::-ms-browse {
    visibility: hidden;
  }

  .custom-file-input:foucs {
    outline: none;
  }

  .custom-file-input::before {
    content: 'Choose File';
    border-radius: 3px;
    border: solid 1px #1d84ff;
    background-color: #fff;
    color: #1d84ff;
    display: inline-block;
    align-items: center;
    justify-content: center;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    line-height: 0.75;
    padding: 10px 16px;
  }

  .custom-file-input:hover::before {
    outline: none;
  }

  .custom-file-input:active {
    outline: none;
  }

  .custom-file-input:active::before {
    outline: none;
  }

  .hints {
    color: #999999;
    font-size: 12px;
  }

  .title {
    font-size: 24px;
    font-weight: 600;
    color: #333333;
  }

  .subTitle {
    font-size: 12px;
    color: #666666;
  }

  .status {
    font-size: 12px;
  }
`;

export const Thumbnail: FC<ThumbnailProps> = ({
  disabled,
  refFun,
  id,
  error,
  status,
  title,
  subTitle,
  source,
}) => {
  return (
    <Wrapper>
      {typeof source === 'string' ? (
        <img src={source} />
      ) : (
        <div className="thumb">
          {getInitials(`${source.firstName} ${source.lastName}`)}
        </div>
      )}
      <div>
        {(!disabled && (
          <>
            <input type="file" className="custom-file-input" />
            <span className="hints">JPG, GIF or PNG</span>
            <span className="hints">Max size of 800K</span>
          </>
        )) || (
          <>
            <span className="title">{title}</span>
            <span className="subTitle">#{subTitle}</span>
            <span className="status">{status}</span>
          </>
        )}
      </div>
    </Wrapper>
  );
};
