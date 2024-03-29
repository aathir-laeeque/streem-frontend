import MemoSignature from '#assets/svg/Signature';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { uploadFile } from '#modules/file-upload/action';
import { useTypedSelector } from '#store';
import { dataUriToBlob } from '#utils/dataUriToBlob';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ParameterProps } from '../Parameter';
import { Wrapper } from './styles';
import { Media } from '#PrototypeComposer/checklist.types';

const Signature: FC<ParameterProps> = ({ parameter, isCorrectingError, isTaskCompleted }) => {
  const {
    auth: { profile },
  } = useTypedSelector((state) => state);

  const [imageData, setImageData] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (parameter.response?.medias) {
      setImageData(
        parameter.response?.medias?.find((currMedia: Media) => !currMedia.archived)?.link,
      );
    }
  }, [parameter.response?.medias]);

  const dispatch = useDispatch();

  const onAcceptSignature = (imageData: string) => {
    if (imageData) {
      const file = dataUriToBlob(imageData);

      const formData = new FormData();

      formData.append('file', file, 'image.jpg');

      dispatch(uploadFile({ formData, parameter, isCorrectingError }));

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
            parameterMandatory: parameter?.mandatory,
          },
          onAcceptSignature: (imageData: string) => onAcceptSignature(imageData),
        },
      }),
    );
  };

  return (
    <Wrapper>
      <div
        className={
          !isTaskCompleted || isCorrectingError
            ? 'signature-interaction active'
            : 'signature-interaction'
        }
        {...((!isTaskCompleted || isCorrectingError) && {
          onClick: openSignatureModal,
        })}
        data-id={parameter.id}
        data-type={parameter.type}
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
        {(!isTaskCompleted || isCorrectingError) && <span>Tap here to sign</span>}
      </div>
    </Wrapper>
  );
};
export default Signature;
