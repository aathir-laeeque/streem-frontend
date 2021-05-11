import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  overflow-y: auto;
  padding: 8px 16px;

  .page-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;

    &-label {
      font-size: 28px;
      color: #000000;
    }

    .icon-wrapper {
      align-items: center;
      border: 1px solid #1d84ff;
      border-radius: 4px;
      display: flex;
      padding: 12px;

      .icon {
        color: #1d84ff;
        font-size: 16px;
      }
    }
  }

  .job-meta-data {
    display: flex;
    justify-content: space-between;

    .card {
      border-radius: 4px;
      box-shadow: 0 4px 4px -2px rgba(24, 39, 75, 0.08),
        0 2px 4px -2px rgba(24, 39, 75, 0.12);
      background-color: #f7f9fa;
      flex: 1;
      margin-right: 24px;

      :last-child {
        margin-right: 0;
      }

      &-header {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.14;
        padding: 16px 16px 8px;
        text-align: left;
      }

      &-body {
        background-color: #e7f1fd;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        color: #1d84ff;
        font-size: 16px;
        font-weight: bold;
        line-height: 1.25;
        padding: 16px;

        &.exception {
          background-color: #f6eed6;
          color: #c29004;
        }
      }
    }
  }

  .job-cwe {
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0 4px 4px -2px rgba(24, 39, 75, 0.08),
      0 2px 4px -2px rgba(24, 39, 75, 0.12);
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    &-label {
      background-color: #f6eed6;
      color: #333333;
      font-size: 20px;
      font-weight: 600;
      padding: 16px;
    }

    &-details {
      display: flex;
      flex-direction: column;
      padding: 16px;

      &-label {
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        margin-top: 8px;
        text-align: left;

        :first-child {
          margin-top: 0;
        }
      }

      &-value {
        color: #666666;
        font-size: 14px;
        font-weight: normal;
        margin-top: 8px;
        text-align: left;

        .media-link {
          color: #1d84ff;
          font-size: 14px;
          font-weight: normal;
        }
      }

      ol {
        padding-inline-start: 24px;
      }
    }
  }

  .duration-summary {
    box-shadow: 0 4px 4px -2px rgba(24, 39, 75, 0.08),
      0 2px 4px -2px rgba(24, 39, 75, 0.12);
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    &-label {
      background-color: #ffffff;
      color: #333333;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
      text-align: left;
      padding: 16px;
    }

    .job-duration {
      background-color: #e7f1fd;
      display: flex;
      flex-direction: column;
      padding: 16px;

      &-label {
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.14;
        text-align: left;
      }

      &-value {
        color: #005dcc;
        font-size: 40px;
        font-weight: 300;
        line-height: 1.2;
        text-align: left;
      }
    }

    .duration-detail-table {
      background-color: #ffffff;
      border-collapse: collapse;

      thead {
        background-color: #eeeeee;

        th {
          color: #000000;
          font-size: 14px;
          font-weight: 600;
          padding: 16px;
          text-align: right;

          &.name {
            text-align: left;
            width: 46%;
          }

          &.stage-duration,
          &.task-duration {
            width: 22%;
          }

          &.exceptions {
            width: 10%;
          }
        }
      }

      tbody {
        tr {
          td {
            color: #333333;
            font-size: 14px;
            font-weight: normal;
            padding: 16px;
            text-align: right;

            &.name {
              text-align: left;

              .container {
                display: flex;

                .stage {
                  &-order {
                    font-weight: bold;
                    margin-right: 4px;
                  }
                  &-name {
                    flex: 1;
                    text-align: left;
                  }
                }
              }
            }

            &.exceptions {
              color: #c29004;

              &.colored {
                background-color: #f6eed6;
              }
            }
          }

          &.total-value-row {
            background-color: #fafafa;
            border-top: 1px solid #eeeeee;

            td {
              &.name,
              &.stage-duration,
              &.task-duration {
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }

  .exception-summary {
    box-shadow: 0 4px 4px -2px rgba(24, 39, 75, 0.08),
      0 2px 4px -2px rgba(24, 39, 75, 0.12);
    display: flex;
    flex-direction: column;
    margin-top: 24px;

    &-label {
      background-color: #ffffff;
      color: #333333;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
      text-align: left;
      padding: 16px;
    }

    .exception-details {
      background-color: #f6eed6;
      display: flex;
      flex-direction: column;
      padding: 16px;

      &-label {
        color: #333333;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.14;
        text-align: left;
      }

      &-value {
        color: #c29004;
        font-size: 40px;
        font-weight: 300;
        line-height: 1.2;
        text-align: left;
      }
    }

    .exceptions-detail-table {
      background-color: #ffffff;
      border-collapse: collapse;

      thead {
        background-color: #dadada;

        th {
          color: #000000;
          font-size: 14px;
          font-weight: 600;
          padding: 16px;
          text-align: left;

          &.name {
            width: 35%;
          }

          &.exception-type {
            width: 15%;
          }

          &.description {
            width: 15%;
          }

          &.initiator {
            width: 20%;
          }

          &.user-remarks {
            width: 15%;
          }
        }
      }

      tbody {
        tr {
          &.stage-detail {
            background-color: #ecedf1;

            td {
              padding: 8px 16px;
            }
          }

          &.exception-detail,
          &.stage-detail {
            td {
              &.name {
                /* width: 35%; */

                .container {
                  display: flex;

                  .order {
                    font-size: 14px;
                    font-weight: bold;
                    color: #333333;
                  }

                  > .name {
                    color: #333333;
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    font-size: 14px;
                    font-weight: normal;
                    margin-left: 4px;
                  }
                }
              }

              &.exception-type {
                .container {
                  display: flex;

                  .exception {
                    &-icon {
                      .icon {
                        font-size: 20px;
                        margin-right: 8px;
                        vertical-align: text-top;
                      }
                    }
                  }
                }
              }

              .initiator-detail {
                align-items: center;
                display: flex;

                .avatar {
                  margin-right: 16px;
                }

                .user {
                  &-detail {
                    display: flex;
                    flex-direction: column;
                  }

                  &-id {
                    color: #999999;
                    font-size: 12px;
                    line-height: 1.33;
                    letter-spacing: 0.32px;
                    text-align: left;
                  }

                  &-name {
                    color: #333333;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 1.2;
                    text-align: left;
                  }
                }
              }
            }
          }

          td {
            color: #333333;
            font-size: 14px;
            font-weight: normal;
            padding: 16px;
            text-align: left;
          }
        }
      }
    }
  }

  .no-summary {
    background-color: #ffffff;
    color: #999999;
    display: flex;
    font-size: 14px;
    font-weight: normal;
    justify-content: center;
    padding: 80px;
  }
`;
