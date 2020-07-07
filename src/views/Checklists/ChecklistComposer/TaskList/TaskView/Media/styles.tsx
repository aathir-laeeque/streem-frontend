import styled from 'styled-components';

export const Wrapper = styled.div.attrs({
  className: 'media-uploader',
})`
  border-radius: 4px;
  background-color: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  padding: 8px;
  display: flex;
  flex-direction: column;

  .media-interaction {
    &-header {
      display: flex;
      color: #ff6a67;
      align-items: center;
      font-size: 12px;
      justify-content: flex-end;
      margin-bottom: 16px;
    }

    &-active-media {
      position: relative;

      > img {
        width: 100%;
        border: 1px solid #666666;
        border-radius: 5px;
      }

      > span {
        position: absolute;
        bottom: 14px;
        left: 8px;
        color: #ffffff;
        font-size: 16px;
        line-height: 0.75;
      }
    }

    &-media {
      &-container {
        margin-top: 16px;
        display: flex;
        flex-wrap: wrap;

        .upload-button {
          border: 1px solid #12aab3;
          border-radius: 50%;
          height: 48px;
          width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
        }
      }

      &-item {
        box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        margin-right: 8px;
        margin-bottom: 8px;
        flex: 0 47.3%;
        display: flex;
        border: 1px solid transparent;

        > img {
          width: 54px;
          border-radius: 5px;
        }

        > div {
          padding: 12px 8px;
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;

          > span {
            color: #666666;
            font-size: 12px;
          }
        }
      }
    }
  }
`;
