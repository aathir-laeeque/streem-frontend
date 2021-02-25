import { BaseModal, Button1, Textarea, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import FullScreenIcon from '#assets/svg/FullScreen';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';
import { Delete } from '@material-ui/icons';

import { Task } from '../checklist.types';
import { addTaskMedia, removeTaskMedia } from '../Tasks/actions';
import { MediaDetails } from '../Tasks/types';

const Wrapper = styled.div<{ fullScreeen: boolean; disabled: boolean }>`
  ${({ fullScreeen, disabled }) => {
    return css`
      .modal {
        /* width: 920px !important; */
        min-width: ${fullScreeen ? '100% !important' : 'calc(100vw - 40vw)'};
        height: ${fullScreeen ? '100%' : 'max-content'};
        background: ${fullScreeen ? 'transparent !important' : 'white'};
        padding: ${fullScreeen ? '10px !important' : 'unset'};

        .close-icon {
          display: ${fullScreeen ? 'none' : 'inline-block'};
        }

        &-body {
          height: ${fullScreeen ? '100%' : 'inherit'};
          padding: 0 !important;

          .wrapper {
            display: flex;
            height: inherit;
            align-items: ${fullScreeen ? 'center' : 'unset'};

            .left-side {
              align-items: center;
              display: flex;
              flex: 2;
              justify-content: center;
              max-width: ${fullScreeen ? '100%' : '600px'};
              max-height: ${fullScreeen ? 'unset' : '90%'};
              height: ${fullScreeen ? '100%' : 'unset'};
              position: relative;

              img {
                max-width: 100%;
                max-height: 100%;
                /* max-width: ${fullScreeen ? '100%' : 'unset'};
                max-height: ${fullScreeen ? '100%' : 'unset'};
                width: ${fullScreeen ? 'unset' : '100%'};
                height: ${fullScreeen ? 'unset' : '100%'}; */
              }

              .full-screen-action {
                position: absolute;
                right: 16px;
                top: 24px;
                width: 24px;
                height: 24px;
                cursor: pointer;
                border-radius: 50%;
                background-color: ${fullScreeen
                  ? 'rgba(0, 0, 0, 1)'
                  : 'rgba(0, 0, 0, 0.2)'};
              }
            }

            .right-side {
              border-left: 1px solid #eeeeee;
              display: ${fullScreeen ? 'none' : 'flex'};
              flex: 1;
              flex-direction: column;
              justify-content: center;
              max-width: 320px;

              .media-details {
                padding: 24px;

                ${disabled
                  ? css`
                      .input-label {
                        color: #999999;
                        font-size: 12px;

                        .optional-badge {
                          display: none;
                        }
                      }
                    `
                  : null}

                .input {
                  margin-bottom: 40px;

                  .input-wrapper {
                    ${disabled
                      ? css`
                          background: none;
                          border: none;
                          padding: 10px 0px;
                          pointer-events: none;

                          input {
                            font-size: 14px;
                            font-weight: bold;
                          }
                        `
                      : null}
                  }
                }

                .textarea {
                  margin-bottom: 15px;

                  .textarea-wrapper {
                    textarea:disabled {
                      background: none;
                      font-size: 14px;
                      color: #000;
                      border-radius: 4px;
                      border: solid 1px #eeeeee;
                      ::placeholder {
                        visibility: hidden;
                      }
                    }
                  }
                }

                button#save-details {
                  margin-left: auto;
                }
              }

              .delete-media {
                display: flex;
                align-items: center;
                padding: 16px 24px;
                margin-top: auto;
                border-top: 1px solid #eeeeee;
                cursor: pointer;
              }
            }
          }
        }
      }
    `;
  }}
`;

type Props = {
  mediaDetails: MediaDetails;
  taskId?: Task['id'];
  isActivity?: boolean;
  showNameInput?: boolean;
  execute: (data: MediaDetails) => void;
  disabled?: boolean;
};

const TaskMediaModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: {
    mediaDetails,
    taskId,
    isActivity = false,
    execute,
    showNameInput = true,
    disabled = false,
  } = {},
}) => {
  const [stateMediaDetails, setStateMediaDetails] = useState<MediaDetails>(
    mediaDetails,
  );

  const [fullScreeen, setFullScreeen] = useState(false);

  const [errors, setErrors] = useState({ name: '' });

  const dispatch = useDispatch();

  return (
    <Wrapper fullScreeen={fullScreeen} disabled={disabled}>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="wrapper">
          <div className="left-side">
            <img src={stateMediaDetails.link} />
            <div
              className="full-screen-action"
              onClick={() => setFullScreeen(!fullScreeen)}
            >
              <FullScreenIcon />
            </div>
          </div>

          <div className="right-side">
            <div className="media-details">
              {showNameInput && (
                <TextInput
                  defaultValue={stateMediaDetails.name}
                  error={errors.name}
                  label="Photo name"
                  name="name"
                  onChange={debounce(({ name, value }) => {
                    setStateMediaDetails({
                      ...stateMediaDetails,
                      [name]: value,
                    });

                    if (!!errors.name) {
                      setErrors({ ...errors, name: '' });
                    }
                  }, 500)}
                />
              )}

              {(!disabled || (disabled && stateMediaDetails.description)) && (
                <Textarea
                  optional
                  defaultValue={stateMediaDetails.description}
                  label="Description"
                  name="description"
                  disabled={disabled}
                  onChange={debounce(({ name, value }) => {
                    setStateMediaDetails({
                      ...stateMediaDetails,
                      [name]: value,
                    });
                  }, 500)}
                  rows={4}
                />
              )}

              {!disabled && (
                <Button1
                  id="save-details"
                  onClick={() => {
                    if (!!stateMediaDetails.name) {
                      if (isActivity && execute) {
                        execute(stateMediaDetails);
                        closeOverlay();
                      } else {
                        dispatch(
                          addTaskMedia({
                            taskId,
                            mediaDetails: { ...stateMediaDetails },
                          }),
                        );
                      }
                    } else {
                      setErrors({ name: 'Name is required' });
                    }
                  }}
                >
                  Save
                </Button1>
              )}
            </div>

            {!disabled && mediaDetails?.id && (
              <div
                className="delete-media"
                onClick={() => {
                  dispatch(removeTaskMedia(taskId, mediaDetails.id));
                }}
              >
                <Delete className="icon" />
                Delete
              </div>
            )}
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TaskMediaModal;
