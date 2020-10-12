import { BaseModal, Button1, Textarea, TextInput } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { FileUploadData } from '#utils/globalTypes';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Task } from '../checklist.types';
import { addTaskMedia } from '../Tasks/actions';
import { MediaDetails } from '../Tasks/types';

const Wrapper = styled.div`
  .modal {
    max-width: 900px !important;
    height: 400px !important;

    &-body {
      height: inherit;
      padding: 0 !important;

      .media {
        &-wrapper {
          display: flex;
          height: inherit;
        }

        &-image {
          &-container {
            flex: 2;
            height: inherit;

            img {
              height: inherit;
              width: 100%;
            }
          }

          &-details {
            flex: 1;
            padding: 24px;

            .input {
              margin-bottom: 40px;
            }

            .textarea {
              margin-bottom: 40px;
            }

            button {
              margin-left: auto;
            }
          }
        }
      }
    }
  }
`;

type Props = {
  fileData: Omit<MediaDetails, 'name' | 'description'>;
  taskId: Task['id'];
};

const TaskMediaModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { fileData, taskId },
}) => {
  const [state, setState] = useState<MediaDetails>({
    ...fileData,
    name: '',
  });

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
        <div className="media-wrapper">
          <div className="media-image-container">
            <img src={fileData.link} />
          </div>

          <div className="media-image-details">
            <TextInput
              defaultValue=""
              error={errors.name}
              label="Photo name"
              name="name"
              onChange={debounce(({ name, value }) => {
                setState({ ...state, [name]: value });

                if (!!errors.name) {
                  console.log('remove name error');
                  setErrors({ ...errors, name: '' });
                }
              }, 500)}
            />

            <Textarea
              optional
              defaultValue=""
              label="Description"
              name="description"
              onChange={debounce(({ name, value }) => {
                setState({ ...state, [name]: value });
              }, 500)}
              rows={4}
            />

            <Button1
              onClick={() => {
                if (!!state.name) {
                  dispatch(
                    addTaskMedia({
                      taskId,
                      mediaDetails: { ...state },
                    }),
                  );
                } else {
                  setErrors({ name: 'Name is required' });
                }
              }}
            >
              Save
            </Button1>
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default TaskMediaModal;
