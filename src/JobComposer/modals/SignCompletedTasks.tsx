import NoTaskToSign from '#assets/svg/NoTaskToSign';
import TaskSignOfComplete from '#assets/svg/TaskSignOfComplete';
import { Avatar, BaseModal, Button, ProgressBar, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { getFullName } from '#utils/stringUtils';
import { Job } from '#views/Jobs/ListView/types';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { debounce, pick } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { resetSignOffTaskError, signOffTasks } from '../actions';
import { InputTypes } from '#utils/globalTypes';

const Wrapper = styled.div<{ isErrorPresent: boolean }>`
  .modal-body {
    padding: 0 !important;
    width: 650px;
  }

  .close-icon {
    top: 24px !important;
    right: 32px !important;
  }

  .header {
    border-bottom: 1px solid #dadada;
    font-size: 20px;
    font-weight: bold;
    padding: 24px 32px;
    text-align: left;
  }

  .body {
    display: flex;
    height: 350px;
    max-height: 350px;
    overflow: auto;

    .text {
      color: #666666;
      font-size: 14px;
      margin-bottom: 24px;
      text-align: left;
    }

    .left-side {
      border-right: 1px solid #dadada;
      flex: 1;
      padding: 24px 32px;

      .sign-off-details {
        > .text {
          font-size: 12px;
          margin-top: 8px;

          :first-of-type {
            color: #000000;
            margin-bottom: 8px;
            margin-top: 0;
          }
        }

        .password-form {
          display: flex;
          flex-direction: column;

          .input-wrapper {
            ${({ isErrorPresent }) =>
              isErrorPresent
                ? css`
                    border-color: #eb5757;
                  `
                : null};
          }

          button {
            margin-top: 40px;
          }

          .input-error {
            color: #eb5757;
            display: flex;
            justify-content: flex-start;
            margin-top: 8px;
          }
        }

        .sign-off-icon {
          font-size: 120px;
        }
      }
    }

    .right-side {
      flex: 1;
      padding: 24px 32px;

      .item {
        display: flex;
        margin-bottom: 16px;

        :last-child {
          margin-bottom: 0;
        }

        .progress-details {
          align-items: flex-start;
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          margin-left: 8px;

          > .text {
            font-size: 12px;
            margin-top: 8px;
          }
        }
      }
    }
  }
`;

type Assignee = {
  assigned: boolean;
  assignedTasks: number;
  completelyAssigned: boolean;
  employeeId: string;
  firstName: string;
  id: string;
  lastName: string;
  pendingSignOffs: number;
  signedOffTasks: number;
};

type Props = {
  allowSignOff: boolean;
  data: Assignee[];
  jobId: Job['id'];
};

const SignCompletedTasksModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { allowSignOff, data: assignees = [], jobId } = {},
}) => {
  const { profile } = useTypedSelector((state) => state.auth);
  const { signOffError } = useTypedSelector((state) => state.composer);

  const dispatch = useDispatch();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isLoggedInUserAssigned = assignees.some((assignee) => assignee.id === profile?.id);

  const otherUsersTasksSignOff = assignees?.filter((assignee) => assignee.id !== profile?.id);

  return (
    <Wrapper isErrorPresent={!!signOffError}>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="header">
          {allowSignOff ? 'Signing Completed Tasks' : 'Signing Off State'}
        </div>

        <div className="body">
          {isLoggedInUserAssigned ? (
            <div className="left-side">
              <div className="text">
                {getFullName({
                  firstName: profile?.firstName ?? '',
                  lastName: profile?.lastName ?? '',
                })}
                , ID : {profile?.employeeId}
              </div>

              {(() => {
                const userTasksSignOff = assignees.filter(
                  (assignee) => assignee.id === profile?.id,
                )[0];

                const { assignedTasks, pendingSignOffs, signedOffTasks } = userTasksSignOff;

                const isSignOffComplete = signedOffTasks === assignedTasks;
                const isSignOffStarted = signedOffTasks !== 0;
                const anyTaskNeedsSignOff = pendingSignOffs > 0;

                const percentageOfTaskCompleted = Math.round(
                  (signedOffTasks / assignedTasks) * 100,
                );

                let displayText = 'No New Tasks Ready to be Signed Off';
                let Icon = NoTaskToSign;

                if (isSignOffComplete) {
                  displayText =
                    'All Good Here! You have already signed all of your completed Tasks';
                  Icon = TaskSignOfComplete;
                }

                if (anyTaskNeedsSignOff) {
                  displayText = `${pendingSignOffs} new Tasks ready to be Signed Off`;
                }

                if (!isSignOffStarted && !anyTaskNeedsSignOff) {
                  displayText = 'Complete Tasks to start Signing them Off';
                  Icon = NoTaskToSign;
                }

                return (
                  <div className="sign-off-details">
                    <div className="text">{displayText}</div>

                    <ProgressBar percentage={percentageOfTaskCompleted} />

                    <div className="text">
                      Signed : {signedOffTasks} of {assignedTasks} tasks
                    </div>

                    {anyTaskNeedsSignOff ? (
                      <div className="password-form">
                        <div className="text">
                          Enter your Password below to Sign your completed Tasks
                        </div>

                        <TextInput
                          afterElementWithoutError
                          AfterElement={showPassword ? VisibilityOff : Visibility}
                          afterElementClass=""
                          afterElementClick={() => setShowPassword((val) => !val)}
                          defaultValue={password}
                          onChange={debounce(({ value }) => {
                            if (!!signOffError) {
                              dispatch(resetSignOffTaskError());
                            }
                            setPassword(value);
                          }, 500)}
                          placeholder="Password"
                          type={showPassword ? InputTypes.PASSWORD : InputTypes.SINGLE_LINE}
                        />

                        {signOffError ? <div className="input-error">{signOffError}</div> : null}

                        <Button
                          onClick={() => {
                            if (jobId) {
                              dispatch(signOffTasks({ jobId, password }));
                            }
                          }}
                        >
                          Sign Off
                        </Button>
                      </div>
                    ) : (
                      <Icon className="sign-off-icon" />
                    )}
                  </div>
                );
              })()}
            </div>
          ) : null}
          <div className="right-side">
            {allowSignOff ? <div className="text">Other Assignees Sign Off State</div> : null}

            {otherUsersTasksSignOff?.map((assignee, index) => {
              const { assignedTasks, id, signedOffTasks } = assignee;

              const percentage = Math.round((signedOffTasks / assignedTasks) * 100);

              return (
                <div key={`${id}-${index}`} className="item">
                  <Avatar
                    color="blue"
                    user={pick(assignee, ['id', 'firstName', 'lastName', 'employeeId'])}
                  />

                  <div className="progress-details">
                    <ProgressBar percentage={percentage} />
                    <div className="text">
                      Signed : {signedOffTasks} of {assignedTasks} tasks
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default SignCompletedTasksModal;
