import { Media } from '#PrototypeComposer/checklist.types';
import AttachFileIcon from '#assets/svg/AttachFile';
import closeIcon from '#assets/svg/close.svg';
import { BaseModal, Button, CustomTag, ImageUploadButton } from '#components';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { CommonOverlayProps, OverlayNames } from '#components/OverlayContainer/types';
import { openLinkInNewTab } from '#utils';
import { apiGetJobAnnotation, apiPostPatchJobAnnotation } from '#utils/apiUrls';
import { fileTypeCheck } from '#utils/parameterUtils';
import { getErrorMsg, request } from '#utils/request';
import { TextareaAutosize } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  #modal-container .modal-background .modal {
    min-width: 450px;
  }
  .modal {
    .close-icon {
      color: #e0e0e0 !important;
      font-size: 16px !important;
      top: 19px !important;
    }

    .modal-header {
      border-bottom: 1px solid #f4f4f4 !important;
      h2 {
        color: #161616 !important;
        font-weight: bold !important;
        font-size: 14px !important;
      }
    }
    .modal-body {
      padding: 0px !important;

      .remark-modal-form-body {
        padding: 16px 16px 16px 26px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .remark-modal-input {
          max-height: 168px;
          border: 1px solid #e0e0e0;
          padding: 11px 16px;
          width: 100%;
        }

        .remark-media-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upload-image {
          color: #1d84ff;
          border: 1px solid #1d84ff;
          width: max-content;
          padding: 6px 16px;
        }
      }

      .media-list-item {
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        align-items: center;
      }

      .media-list-item-head {
        display: flex;
        gap: 8px;
        color: #1d84ff;
        font-size: 14px;
      }

      .remark-modal-footer {
        border-top: 1px solid #f4f4f4 !important;
        display: flex;
        align-items: center;
        padding: 16px;
        justify-content: space-between;
      }

      .remark-modal-footer-right {
        display: flex;
        align-items: center;
      }
    }
  }
`;

type Props = {
  jobId: string;
  modalTitle?: string;
  onSubmitModalText?: string;
};

const AddRemark = (props: CommonOverlayProps<Props>) => {
  const {
    props: { modalTitle, onSubmitModalText, jobId },
    closeOverlay,
    closeAllOverlays,
  } = props;
  const [mediaData, setMediaData] = useState([]);
  const [annotationData, setAnnotationData] = useState<any>({
    id: '',
    remarks: '',
    medias: [],
  });
  const { register, formState, getValues, watch, reset } = useForm<any>({
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: { remarks: '' },
  });
  const { remarks } = watch(['remarks']);
  const { isDirty, isValid } = formState;

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { data } = await request('GET', apiGetJobAnnotation(jobId));
      if (data) {
        reset({ remarks: data.remarks });
        setMediaData(data.medias);
        setAnnotationData(data);
      }
    })();
  }, []);

  const onSubmitModal = async () => {
    try {
      const payload = {
        jobId: jobId,
        remarks,
        ids: mediaData.map((el: Media) => el.mediaId || el.id),
      };

      const { data, errors } = await request(
        annotationData?.id ? 'PATCH' : 'POST',
        apiPostPatchJobAnnotation(annotationData?.id ? jobId : ''),
        {
          data: payload,
        },
      );
      if (data) {
        dispatch(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: annotationData?.id
              ? 'Annotation Updated Successfully!'
              : 'Annotation Added Successfully!',
            detail: annotationData?.id
              ? 'Your annotation has been successfully updated for this job.'
              : 'Your annotation remark has been successfully added to this job',
          }),
        );
        closeOverlay();
      } else if (errors) {
        throw getErrorMsg(errors);
      }
    } catch (error) {
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
        }),
      );
    }
  };

  const archiveAnnotation = async (reason: string, setFormErrors: (errors?: Error[]) => void) => {
    try {
      const { data, errors } = await request('DELETE', apiPostPatchJobAnnotation(jobId), {
        data: { reason },
      });

      if (data) {
        dispatch(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: 'Annotation Deleted Successfully!',
            detail: 'Your annotation has been successfully deleted for this job.',
          }),
        );
        closeAllOverlays();
      } else if (errors) {
        throw getErrorMsg(errors);
      }
      setFormErrors(errors);
    } catch (error) {
      dispatch(
        showNotification({
          type: NotificationType.ERROR,
          msg: typeof error !== 'string' ? 'Oops! Please Try Again.' : error,
        }),
      );
    }
  };

  const onUploadedFile = (fileData: Media) => {
    setMediaData([...mediaData, fileData]);
  };

  const onDeleteFile = (index: number) => {
    var arr = [...mediaData];
    arr.splice(index, 1);
    setMediaData(arr);
  };

  const checkDisable = () => {
    if (annotationData?.id) {
      if (!mediaData.some((obj) => 'mediaId' in obj)) {
        return !isValid || !isDirty;
      } else {
        return false;
      }
    } else {
      return !isValid || !isDirty;
    }
  };

  return (
    <Wrapper>
      <BaseModal
        onSecondary={closeOverlay}
        closeModal={closeOverlay}
        closeAllModals={closeAllOverlays}
        title={modalTitle ? modalTitle : 'Add Remarks'}
        showFooter={false}
      >
        <div className="remark-modal-form-body">
          <TextareaAutosize
            className="remark-modal-input"
            ref={register({
              required: true,
              pattern: /^(?!\s)(.*\S)?$/, // At least one non-space character, no leading or trailing spaces
            })}
            name="remarks"
            placeholder="Write here"
            minRows={4}
            maxRows={8}
          />

          <div className="remark-media-section">
            {mediaData.map((media: Media, index: number) => {
              if (media?.archived === false) {
                const mediaType = media?.type?.split('/')[1];
                const isImage = fileTypeCheck(['png', 'jpg', 'jpeg'], mediaType);
                return (
                  <div className="media-list-item" key={index}>
                    <CustomTag
                      className="media-list-item-head"
                      as={isImage ? 'a' : 'div'}
                      target={isImage ? '_blank' : undefined}
                      href={isImage ? media.link : undefined}
                      onClick={
                        isImage
                          ? undefined
                          : () => {
                              const queryString = new URLSearchParams({
                                link: media.link,
                              }).toString();
                              openLinkInNewTab(`/jobs/${jobId}/fileUpload/print?${queryString}`);
                            }
                      }
                    >
                      <span> {media?.originalFilename}</span>
                    </CustomTag>
                    <img
                      src={closeIcon}
                      className="media-list-item-remove-icon"
                      onClick={() => {
                        onDeleteFile(index);
                      }}
                    />
                  </div>
                );
              } else {
                return null;
              }
            })}

            <ImageUploadButton
              label="Attach document"
              onUploadSuccess={(fileData) => {
                onUploadedFile(fileData);
              }}
              icon={AttachFileIcon}
              onUploadError={(data) => {
                console.log('zero check error', data);
              }}
              acceptedTypes={[
                'image/*',
                '.pdf',
                '.doc',
                '.docx',
                '.png',
                '.jpg',
                '.jpeg',
                '.xlsx',
                '.xls',
                '.ppt',
                '.pptx',
              ]}
            />
          </div>
        </div>
        <div className="remark-modal-footer">
          <Button
            variant="textOnly"
            disabled={annotationData?.id ? false : true}
            onClick={() =>
              dispatch(
                openOverlayAction({
                  type: OverlayNames.REASON_MODAL,
                  props: {
                    modalTitle: 'Clear Remarks',
                    modalDesc: (
                      <div>
                        <div style={{ textAlign: 'left', fontSize: '14px', marginBottom: '4px' }}>
                          You are about to clear all remarks for this job, which will also remove
                          any attached documents you've provided.
                        </div>
                        <div style={{ textAlign: 'left', fontSize: '14px' }}>
                          Please note, this action cannot be undone. Are you absolutely sure you
                          want to proceed?
                        </div>
                      </div>
                    ),
                    onSubmitModalText: 'Confirm',
                    onSubmitHandler: (reason: string, setFormErrors: (errors?: Error[]) => void) =>
                      archiveAnnotation(reason, setFormErrors),
                  },
                }),
              )
            }
          >
            Clear Remarks
          </Button>
          <div className="remark-modal-footer-right">
            <Button variant="secondary" onClick={() => closeOverlay()}>
              Cancel
            </Button>
            <Button color="blue" onClick={onSubmitModal} disabled={checkDisable()}>
              {onSubmitModalText ? onSubmitModalText : 'Submit'}
            </Button>
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default AddRemark;
