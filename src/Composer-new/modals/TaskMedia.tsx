import { BaseModal, Button1, Textarea, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Delete } from '@material-ui/icons';

import { Task } from '../checklist.types';
import { addTaskMedia, removeTaskMedia } from '../Tasks/actions';
import { MediaDetails } from '../Tasks/types';

const Wrapper = styled.div`
  .modal {
    width: 920px !important;
    height: max-content;

    &-body {
      height: inherit;
      padding: 0 !important;

      .wrapper {
        display: flex;
        height: inherit;

        .left-side {
          align-items: center;
          display: flex;
          flex: 2;
          justify-content: center;
          max-width: 600px;
          max-height: 400px;

          img {
            height: 100%;
            width: 100%;
          }
        }

        .right-side {
          border-left: 1px solid #eeeeee;
          display: flex;
          flex: 1;
          flex-direction: column;
          max-width: 320px;

          .media-details {
            padding: 24px;

            .input {
              margin-bottom: 40px;
            }

            .textarea {
              margin-bottom: 15px;
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

type Props = {
  mediaDetails: MediaDetails;
  taskId?: Task['id'];
  isActivity?: boolean;
  execute: (data: any) => void;
};

const TaskMediaModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { mediaDetails, taskId, isActivity = false, execute } = {},
}) => {
  const [stateMediaDetails, setStateMediaDetails] = useState<MediaDetails>(
    mediaDetails,
  );

  const [errors, setErrors] = useState({ name: '' });

  const dispatch = useDispatch();

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="wrapper">
          <div className="left-side">
            <img src={stateMediaDetails.link} />
          </div>

          <div className="right-side">
            <div className="media-details">
              <TextInput
                defaultValue={stateMediaDetails.name}
                error={errors.name}
                label="Photo name"
                name="name"
                onChange={debounce(({ name, value }) => {
                  setStateMediaDetails({ ...stateMediaDetails, [name]: value });

                  if (!!errors.name) {
                    setErrors({ ...errors, name: '' });
                  }
                }, 500)}
              />

              <Textarea
                optional
                defaultValue={stateMediaDetails.description}
                label="Description"
                name="description"
                onChange={debounce(({ name, value }) => {
                  setStateMediaDetails({ ...stateMediaDetails, [name]: value });
                }, 500)}
                rows={4}
              />

              <Button1
                id="save-details"
                onClick={() => {
                  if (!!stateMediaDetails.name) {
                    if (isActivity) {
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
            </div>

            <div
              className="delete-media"
              onClick={() => {
                dispatch(removeTaskMedia(taskId, mediaDetails?.id));
              }}
            >
              <Delete className="icon" />
              Delete
            </div>
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TaskMediaModal;
