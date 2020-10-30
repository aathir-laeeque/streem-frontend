import { Avatar, BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Checklist } from '#Composer-new/checklist.types';
import { fetchApprovers } from '#Composer-new/reviewer.actions';
import { CollaboratorState } from '#Composer-new/reviewer.types';
import { useTypedSelector } from '#store';
import { groupBy } from 'lodash';
import moment from 'moment';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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

                .right-container {
                  display: flex;
                  flex-direction: column;
                  align-items: flex-end;
                  font-size: 10px;
                  color: #999999;

                  .right {
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-size: 12px;
                    background-color: #eeeeee;
                    color: #999999;
                    float: right;
                    margin-bottom: 4px;
                  }

                  .right.success {
                    background-color: #e1fec0;
                    color: #427a00;
                  }
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
  const dispatch = useDispatch();
  const { data, approvers } = useTypedSelector((state) => ({
    approvers: state.prototypeComposer.approvers,
    data: state.prototypeComposer.data as Checklist,
  }));

  useEffect(() => {
    dispatch(fetchApprovers(data.id));
  }, []);

  const groupedApprovers = groupBy(approvers, 'orderTree');
  const groupedViews: any = [];

  Object.keys(groupedApprovers).forEach((key) => {
    groupedViews.push(
      <>
        <tr key={key}>
          <td rowSpan={groupedApprovers[key].length}>
            <div
              className="heading"
              style={{ marginTop: key !== '1' ? '40px' : '0px' }}
            >
              <div className="top">
                <span>
                  {key === '1'
                    ? 'Author'
                    : key === '2'
                    ? 'Reviewer'
                    : 'Approver'}
                </span>
                <div className="ellipse">{key}</div>
              </div>
              <span className="light">
                {groupedApprovers[key].some(
                  (a) => a.state === CollaboratorState.NOT_STARTED,
                )
                  ? 'In Progress'
                  : 'Complete'}
              </span>
            </div>
          </td>
          <td>
            <div
              className="item"
              style={{ marginTop: key !== '1' ? '40px' : '0px' }}
            >
              <Avatar size="large" user={groupedApprovers[key][0]} />
              <div className="middle">
                <span className="userId">
                  {groupedApprovers[key][0].employeeId}
                </span>
                <span className="userName">
                  {groupedApprovers[key][0].firstName}{' '}
                  {groupedApprovers[key][0].lastName}
                </span>
              </div>
              {groupedApprovers[key][0].state ===
              CollaboratorState.NOT_STARTED ? (
                <div className="right">Pending</div>
              ) : (
                <div className="right-container">
                  <div className="right success">Signed</div>
                  {groupedApprovers[key][0].modifiedAt &&
                    moment
                      .unix(groupedApprovers[key][0].modifiedAt)
                      .format('Do MMM, YYYY, HH:mm a')}
                </div>
              )}
            </div>
          </td>
        </tr>
        {groupedApprovers[key].slice(1).map((a) => (
          <tr key={a.employeeId}>
            <td>
              <div className="item">
                <Avatar size="large" user={a} />
                <div className="middle">
                  <span className="userId">{a.employeeId}</span>
                  <span className="userName">
                    {a.firstName} {a.lastName}
                  </span>
                </div>
                {a.state === CollaboratorState.NOT_STARTED ? (
                  <div className="right">Pending</div>
                ) : (
                  <div className="right-container">
                    <div className="right success">Signed</div>
                    {a.modifiedAt &&
                      moment.unix(a.modifiedAt).format('Do MMM, YYYY, HH:mm a')}
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </>,
    );
  });

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
            {groupedViews}
          </tbody>
        </table>
      </BaseModal>
    </Wrapper>
  );
};

export default SignOffProgressModal;
