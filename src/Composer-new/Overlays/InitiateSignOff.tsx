import { Avatar, BaseModal, Checkbox } from '#components';
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

    .modal-footer {
      padding: 24px 50px !important;
      flex-direction: row-reverse !important;
      border-top: 1px solid #eeeeee !important;
    }

    .modal-body {
      padding: 32px !important;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: column;

      > table {
        tbody {
          tr {
            :nth-child(-n + 2) {
              td {
                border: none;
              }
            }

            :last-child {
              td {
                border-bottom: none;
              }
            }

            td {
              padding: 12px 0px;
              min-width: 120px;
              border-left: 1px solid #eeeeee;
              border-bottom: 1px solid #eeeeee;

              :first-child {
                min-width: 336px;
                border-left: none;
              }

              .heading {
                font-weight: bold;
                font-size: 14px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                &.light {
                  font-weight: normal;
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
                  margin-bottom: 8px;
                }
              }

              .item {
                display: flex;
                align-items: center;

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
              }

              .checkmark-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;

                .container {
                  padding-left: 9px;
                }

                .checkmark {
                  border-radius: 0px;
                  border-color: #333;
                  background-color: #fff;
                  border-width: 2px;
                }
              }
            }
          }
        }
      }
    }
  }
`;

const InitiateSignOffModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Initiate Sequential Sign Off"
        primaryText="Initiate"
        secondaryText="Cancel"
        onSecondary={() => console.log('On Secondary')}
        onPrimary={() => console.log('On Primary')}
      >
        <table cellSpacing={0} cellPadding={0}>
          <tbody>
            <tr>
              <td />
              <td colSpan={3}>
                <div className="heading light">Signing As</div>
              </td>
            </tr>
            <tr>
              <td />
              <td>
                <div className="heading">
                  <div className="ellipse">1</div>
                  Author
                </div>
              </td>
              <td>
                <div className="heading">
                  <div className="ellipse">2</div>Reviewer
                </div>
              </td>
              <td>
                <div className="heading">
                  <div className="ellipse">3</div>Approver
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
                </div>
              </td>
              <td>
                <div className="checkmark-wrapper">
                  <Checkbox
                    checked={false}
                    label=""
                    onClick={() => console.log('checked')}
                  />
                </div>
              </td>
              <td>
                <div className="checkmark-wrapper">
                  <Checkbox
                    checked={false}
                    label=""
                    onClick={() => console.log('checked')}
                  />
                </div>
              </td>
              <td>
                <div className="checkmark-wrapper">
                  <Checkbox
                    checked={false}
                    label=""
                    onClick={() => console.log('checked')}
                  />
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
                </div>
              </td>
              <td>
                <div className="checkmark-wrapper">
                  <Checkbox
                    checked={false}
                    label=""
                    onClick={() => console.log('checked')}
                  />
                </div>
              </td>
              <td>
                <div className="checkmark-wrapper">
                  <Checkbox
                    checked={false}
                    label=""
                    onClick={() => console.log('checked')}
                  />
                </div>
              </td>
              <td>
                <div className="checkmark-wrapper">
                  <Checkbox
                    checked={false}
                    label=""
                    onClick={() => console.log('checked')}
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </BaseModal>
    </Wrapper>
  );
};

export default InitiateSignOffModal;
