import MemoSignature from '#assets/svg/Signature';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { dataUriToBlob } from '#utils/dataUriToBlob';
import { ComposerState } from '#views/Checklists/NewComposer/composer.types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityProps } from '../types';
import { uploadFile } from './actions';
import { Wrapper } from './styles';

const Signature: FC<ActivityProps> = ({ activity }) => {
  const { composerState } = useTypedSelector((state) => state.newComposer);
  const { profile } = useTypedSelector((state) => state.auth);
  const isChecklistEditable =
    composerState !== ComposerState.EDIT &&
    composerState !== ComposerState.EXECUTED;
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
        openOverlayAction({
          type: OverlayNames.SIGNATURE_MODAL,
          props: {
            user: {
              id: profile?.employeeId,
              name: `${profile?.firstName} ${profile?.lastName}`,
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
                <span>{`${profile?.firstName} ${profile?.lastName}`}</span>
                <span>ID: {profile?.employeeId}</span>
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
