import MemoSignature from '#assets/svg/Signature';
import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { useTypedSelector } from '#store';
import { dataUriToBlob } from '#utils/dataUriToBlob';
import { uploadFile } from '#modules/file-upload/action';

import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const Signature: FC<ActivityProps> = ({ activity }) => {
  const {
    // composer: { entity },
    auth: { profile },
  } = useTypedSelector((state) => state);

  let image: string | null = null;

  if (activity.response?.medias) {
    image = activity.response?.medias[0]?.link;
  }

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
    dispatch(
      openModalAction({
        type: ModalNames.SIGNATURE_MODAL,
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
        className="signature-interaction active"
        onClick={openSignatureModal}
      >
        {(imageData && (
          <div>
            <img style={{ width: '100%' }} src={imageData} />
          </div>
        )) || (
          <div className="icon-container">
            <MemoSignature fontSize={48} color="#1d84ff" />
          </div>
        )}
        <span>Tap here to sign</span>
      </div>
    </Wrapper>
  );
};
export default Signature;
