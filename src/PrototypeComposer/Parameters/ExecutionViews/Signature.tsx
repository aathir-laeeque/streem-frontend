import { ParameterProps } from '#PrototypeComposer/Activity/types';
import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { OverlayNames } from '#components/OverlayContainer/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { dataUriToBlob } from '#utils/dataUriToBlob';
import { uploadFile } from '#modules/file-upload/action';
import { useTypedSelector } from '#store';
import { useDispatch } from 'react-redux';
import MemoSignature from '#assets/svg/Signature';

const SignatureTaskViewWrapper = styled.div`
  align-items: center;
  background-color: #f4f4f4;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  gap: 8px;

  .icon {
    font-size: 48px;
    margin-bottom: 8px;
    cursor: not-allowed;
  }

  span {
    font-size: 14px;
    line-height: 1.14;
    letter-spacing: 0.16px;
    color: #525252;
  }
`;

const SignatureTaskView: FC<Omit<ParameterProps, 'taskId'>> = ({ parameter, form }) => {
  const {
    auth: { profile },
  } = useTypedSelector((state) => state);

  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    if (parameter.response?.medias) {
      setImageData(parameter.response?.medias[0]?.link);
    }
  }, [parameter.response?.medias]);

  const dispatch = useDispatch();

  const onAcceptSignature = (imageData: string) => {
    if (imageData) {
      const file = dataUriToBlob(imageData);
      const formData = new FormData();
      formData.append('file', file, 'image.jpg');
      setImageData(imageData);
    }
  };

  const openSignatureModal = () => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.SIGNATURE_MODAL,
        props: {
          user: {
            id: profile?.employeeId,
            name: `${profile?.firstName} ${profile?.lastName}`,
          },
          onAcceptSignature: (imageData: string) => onAcceptSignature(imageData),
        },
      }),
    );
  };
  return (
    <SignatureTaskViewWrapper data-id={parameter.id} data-type={parameter.type}>
      <div className={'signature-interaction active'} onClick={openSignatureModal}>
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
    </SignatureTaskViewWrapper>
  );
};

export default SignatureTaskView;
