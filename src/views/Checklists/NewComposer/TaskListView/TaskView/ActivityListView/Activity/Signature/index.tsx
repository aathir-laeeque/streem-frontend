import React, { FC, useState } from 'react';

import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { useDispatch } from 'react-redux';
import MemoSignature from '#assets/svg/Signature';
import { ActivityProps } from '../types';
import { uploadFile } from './actions';
import { ChecklistState } from '#views/Checklists/types';
import { useTypedSelector } from '#store';
import { dataUriToBlob } from '#utils/dataUriToBlob';
import { Wrapper } from './styles';

const Signature: FC<ActivityProps> = ({ activity }) => {
  const { state } = useTypedSelector((state) => state.checklist.composer);
  const isChecklistEditable =
    state !== ChecklistState.ADD_EDIT && state !== ChecklistState.EXECUTED;

  let image: string | null = null;
  if (activity.response?.medias) image = activity.response?.medias[0].link;

  const [imageData, setImageData] = useState<string | null>(image);
  const dispatch = useDispatch();

  const onAcceptSignature = (imageData: string) => {
    if (imageData) {
      const file = dataUriToBlob(imageData);
      const formData = new FormData();
      formData.append('file', file, 'image.jpg');
      dispatch(uploadFile({ formData, activity }));
      setImageData(imageData);
    }
  };

  const openSignatureModal = () => {
    if (isChecklistEditable)
      dispatch(
        openModalAction({
          type: ModalNames.SIGNATURE_MODAL,
          props: {
            user: {
              id: '1235679849',
              name: 'Janam Shah',
            },
            onAcceptSignature: (imageData: string) =>
              onAcceptSignature(imageData),
          },
        }),
      );
  };

  return (
    <Wrapper>
      <div
        className={`signature-interaction ${
          isChecklistEditable ? 'active' : ''
        }`}
        onClick={openSignatureModal}
      >
        {(imageData && (
          <div>
            <div className="signed-header">
              <div className="top-left">
                <span>30 June, 2020</span>
                <span>06:30 P.M</span>
              </div>
              <div className="top-right">
                <span>Janam Shah</span>
                <span>ID: 1235679849</span>
              </div>
            </div>
            <img style={{ width: '100%' }} src={imageData} />
          </div>
        )) || (
          <div className="icon-container">
            <MemoSignature
              fontSize={48}
              color={!isChecklistEditable ? '#BDBDBD' : '#1d84ff'}
            />
          </div>
        )}
        <span>
          {!isChecklistEditable
            ? 'User will tap here to record their signature'
            : 'Tap here to record your signature'}
        </span>
      </div>
    </Wrapper>
  );
};

export default Signature;
