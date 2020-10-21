import { Avatar, BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .modal {
    min-width: 400px !important;

    .close-icon {
      top: 22px !important;
      right: 16px !important;
      font-size: 24px !important;
    }

    h2 {
      color: #000 !important;
      font-weight: bold !important;
    }

    .modal-header {
      padding: 24px 32px !important;
      border-bottom: 1px solid #eeeeee !important;
    }

    .modal-body {
      padding: 24px 32px 47px !important;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: column;

      > table {
        tbody {
          tr {
            td {
              border-right: 1px solid #eeeeee;
            }

            :last-child {
              td {
                border: none;
              }
            }

            td[rowspan] {
              vertical-align: top;
            }

            td[colspan] {
              padding: 0px 0px 15px 80px;

              .heading {
                align-items: flex-start;
              }
            }

            td {
              min-width: 92px;

              :last-child {
                min-width: 520px;
                border: none;
              }

              .heading {
                font-size: 14px;
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                .top {
                  display: flex;
                  align-items: center;
                  justify-content: flex-end;

                  span {
                    font-weight: bold;
                    font-size: 14px;
                    margin-right: 8px;
                  }

                  .ellipse {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: solid 1px #fff;
                    background-color: #999999;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    margin-right: -14px;
                  }
                }

                span.light {
                  font-size: 14px;
                  margin-right: 18px;
                }
              }

              .item {
                padding: 12px;
                margin-left: 20px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #eeeeee;

                .middle {
                  display: flex;
                  flex: 1;
                  flex-direction: column;
                  justify-content: center;
                  align-items: flex-start;
                  padding: 0 15px;

                  .userId {
                    font-size: 8px;
                    font-weight: 600;
                    color: #666666;
                    height: 11px;
                  }
                  .userName {
                    font-size: 20px;
                    color: #666666;
                    text-transform: capitalize;
                  }
                }

                .right {
                  padding: 2px 4px;
                  border-radius: 4px;
                  font-size: 12px;
                  background-color: #eeeeee;
                  color: #999999;
                }

                .right.success {
                  background-color: #e1fec0;
                  color: #427a00;
                }
              }

              .item.no-border {
                border: none;
              }
            }
          }
        }
      }
    }
  }
`;

const SignOffProgressModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Sequential Sign Off In Process"
        showFooter={false}
      >
        <table cellSpacing={0} cellPadding={0}>
          <tbody>
            <tr>
              <td colSpan={2}>
                <div className="heading">Signing Order</div>
              </td>
            </tr>
            <tr>
              <td rowSpan={3}>
                <div className="heading">
                  <div className="top">
                    <span>Author</span>
                    <div className="ellipse">1</div>
                  </div>
                  <span className="light">In Progress</span>
                </div>
              </td>
              <td>
                <div className="item">
                  <Avatar
                    size="large"
                    user={{
                      firstName: 'Some',
                      lastName: 'User',
                      employeeId: 'EMP12312',
                      id: 25665,
                    }}
                  />
                  <div className="middle">
                    <span className="userId">EMP12312</span>
                    <span className="userName">Some User</span>
                  </div>
                  <div className="right success">Signed</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="item">
                  <Avatar
                    size="large"
                    user={{
                      firstName: 'Some',
                      lastName: 'User',
                      employeeId: 'EMP12312',
                      id: 25665,
                    }}
                  />
                  <div className="middle">
                    <span className="userId">EMP12312</span>
                    <span className="userName">Some User</span>
                  </div>
                  <div className="right success">Signed</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="item no-border">
                  <Avatar
                    size="large"
                    user={{
                      firstName: 'Some',
                      lastName: 'User',
                      employeeId: 'EMP12312',
                      id: 25665,
                    }}
                  />
                  <div className="middle">
                    <span className="userId">EMP12312</span>
                    <span className="userName">Some User</span>
                  </div>
                  <div className="right">Pending</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </BaseModal>
    </Wrapper>
  );
};

export default SignOffProgressModal;
