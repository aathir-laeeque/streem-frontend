import styled, { css } from 'styled-components';

const Wrapper = styled.div.attrs({
  className: 'stage-list-item',
})<{
  isActive: boolean;
  isAnyTaskStarted: boolean;
  allTasksCompleted: boolean;
  anyTaskHasError: boolean;
}>`
  background-color: #ffffff;
  border: solid 1px transparent;
  border-color: #eeeeee;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px;
  line-height: 1.33;

  @media (max-width: 1200px) {
    padding: 12px;
  }

  .stage {
    &-header {
      align-items: center;
      display: flex;

      .stage-order {
        color: #666666;
        font-size: 12px;
        line-height: 1.33;
      }

      .stop-icon {
        margin-left: auto;
        visibility: hidden;
      }

      .stage-badge {
        align-items: center;
        background-color: #f4f4f4;
        border-radius: 4px;
        display: flex;
        padding: 4px;

        > .icon {
          color: #999999;
          font-size: 16px;
          margin-right: 4px;
        }

        span {
          font-size: 12px;
          line-height: 0.83;
          color: #999999;
        }
      }
    }

    &-name {
      color: #000000;
      font-size: 14px;
      margin-top: 8px;
      line-height: 1.14;
    }

    &-task-bar {
      margin-top: 16px;

      span {
        color: #000000;
        display: block;
        font-size: 12px;
        line-height: 1.33;
        margin-bottom: 8px;
      }
    }
  }

  ${({ isActive }) =>
    isActive
      ? css`
          border-color: #1d84ff;
          box-shadow: 0 8px 8px 0 rgba(153, 153, 153, 0.16);
        `
      : null}

  ${({ isAnyTaskStarted, allTasksCompleted, anyTaskHasError }) => {
    if (allTasksCompleted) {
      return css`
        ${({ isActive }) =>
          isActive
            ? css`
                border-color: #5aa700;
              `
            : null}

        .stage-header {
          .stage-badge {
            background-color: #e1fec0;

            .icon,
            span {
              color: #5aa700;
            }
          }
        }

        .stage-task-bar {
          .filler {
            background-color: #5aa700;
          }
        }
      `;
    }

    if (anyTaskHasError) {
      return css`
        border-color: #ff6b6b;

        .stage-header {
          .stage-badge {
            background-color: #ffebeb;

            .icon,
            span {
              color: #ff6b6b;
            }
          }
        }

        .stage-task-bar {
          .filler {
            background-color: #ff6b6b;
          }
        }
      `;
    }

    if (isAnyTaskStarted) {
      return css`
        .stage-header {
          .stage-badge {
            background-color: #d6e9ff;

            .icon,
            span {
              color: #1d84ff;
            }
          }
        }
      `;
    }
  }}
`;

export default Wrapper;
