import { Avatar, BaseModal, Checkbox } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Checklist } from '#Composer-new/checklist.types';
import { initiateSignOff } from '#Composer-new/reviewer.actions';
import { CollaboratorType } from '#Composer-new/reviewer.types';
import { useTypedSelector } from '#store';
import { uniqBy } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
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

                .container input:checked ~ .checkmark {
                  background-color: #1d84ff;
                  border: none;
                }

                .container input:disabled ~ .checkmark {
                  background-color: #dadada;
                  border: none;
                }
              }
            }
          }
        }
      }
    }
  }
`;

type ParsedUser = {
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  id: string;
  type: CollaboratorType;
  checkedAuthor: boolean;
  checkedReviewer: boolean;
  checkedApprover: boolean;
};

const InitiateSignOffModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
}) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<ParsedUser[]>([]);
  const [selection, setSelection] = useState<
    { userId: string; orderTree: number }[]
  >([]);

  const { data, userId, collaborators } = useTypedSelector((state) => ({
    userId: state.auth.userId,
    data: (state.prototypeComposer.data as unknown) as Checklist,
    collaborators: uniqBy(
      ((state.prototypeComposer.data as unknown) as Checklist).collaborators,
      'id',
    ),
  }));

  useEffect(() => {
    const newUsers = data.authors.map((a) => ({
      id: a.id,
      email: a.email,
      firstName: a.firstName,
      lastName: a.lastName,
      employeeId: a.employeeId,
      type: CollaboratorType.AUTHOR,
      checkedAuthor: true,
      checkedReviewer: false,
      checkedApprover: false,
    }));

    collaborators.forEach((a) => {
      newUsers.push({
        id: a.id,
        email: a.email,
        firstName: a.firstName,
        lastName: a.lastName,
        employeeId: a.employeeId,
        type: CollaboratorType.REVIEWER,
        checkedAuthor: false,
        checkedReviewer: false,
        checkedApprover: false,
      });
    });

    setUsers(newUsers);
    setSelection(data.authors.map((a) => ({ userId: a.id, orderTree: 1 })));
  }, []);

  const onCheckChange = (id: string, orderTree: number) => {
    let checking = true;

    const newUsers = users.map((u) => {
      if (u.id !== id) {
        return u;
      } else {
        switch (orderTree) {
          case 1:
            if (u.checkedAuthor) checking = false;
            return { ...u, checkedAuthor: !u.checkedAuthor };
          case 2:
            if (u.checkedReviewer) checking = false;
            return { ...u, checkedReviewer: !u.checkedReviewer };
          case 3:
            if (u.checkedApprover) checking = false;
            return { ...u, checkedApprover: !u.checkedApprover };
          default:
            return u;
        }
      }
    });

    setUsers(newUsers);

    if (checking) {
      setSelection([...selection, { userId: id, orderTree }]);
    } else {
      setSelection(selection.filter((s) => s.userId !== id));
    }
  };

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        title="Initiate Sequential Sign Off"
        primaryText="Initiate"
        secondaryText="Cancel"
        onSecondary={() => console.log('On Secondary')}
        onPrimary={() => dispatch(initiateSignOff(data.id, selection))}
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
                  <div className="ellipse">2</div>Collaborator
                </div>
              </td>
              <td>
                <div className="heading">
                  <div className="ellipse">3</div>Approver
                </div>
              </td>
            </tr>
            {users.map((u) => (
              <tr key={u.employeeId}>
                <td>
                  <div className="item">
                    <Avatar size="large" user={u} />
                    <div className="middle">
                      <span className="userId">{u.employeeId}</span>
                      <span className="userName">
                        {u.firstName} {u.lastName}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="checkmark-wrapper">
                    {u.type === CollaboratorType.AUTHOR && (
                      <Checkbox
                        checked
                        disabled
                        label=""
                        onClick={() => console.log('checked')}
                      />
                    )}
                  </div>
                </td>
                <td>
                  <div className="checkmark-wrapper">
                    {u.type === CollaboratorType.REVIEWER && (
                      <Checkbox
                        checked={u.checkedReviewer}
                        label=""
                        onClick={() => onCheckChange(u.id, 2)}
                      />
                    )}
                  </div>
                </td>
                <td>
                  <div className="checkmark-wrapper">
                    <Checkbox
                      checked={u.checkedApprover}
                      label=""
                      onClick={() => onCheckChange(u.id, 3)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </BaseModal>
    </Wrapper>
  );
};

export default InitiateSignOffModal;
