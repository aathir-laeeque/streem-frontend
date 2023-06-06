import { BaseModal, Select } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { CommonOverlayProps, OverlayNames } from '#components/OverlayContainer/types';
import useQrDecode from '#utils/useQrDecode';
import { editQrData } from '#views/Ontology/actions';
import { Object } from '#views/Ontology/types';
import React, { createRef, FC, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
type Props = {
  id: string;
  title: string;
  onPrimary: () => void;
  secondaryText?: string;
  primaryText: string;
  data: any;
  selectedObject: Object;
};

const QRGeneratorWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;
const Wrapper = styled.div`
  .modal-footer {
    .modal-footer-buttons {
      margin-left: auto;
    }
  }
`;

export const QRGenerator: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { id, title, onPrimary, data, primaryText, secondaryText = 'Cancel', selectedObject },
}) => {
  return (
    <Wrapper>
      <BaseModal
        title={title}
        onPrimary={onPrimary}
        onSecondary={closeOverlay}
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        primaryText={primaryText}
        secondaryText={secondaryText}
        modalFooterOptions={
          <UploadButton selectedObject={selectedObject} closeAllOverlays={closeAllOverlays} />
        }
      >
        <QRGeneratorWrapper>
          <QRCode id={id} value={typeof data === 'string' ? data : JSON.stringify(data)} />
        </QRGeneratorWrapper>
      </BaseModal>
    </Wrapper>
  );
};

const UploadButton: FC<{
  selectedObject: Object;
  closeAllOverlays: any;
}> = ({ selectedObject, closeAllOverlays }) => {
  const fileRef = createRef<HTMLInputElement>();
  const [state, setState] = useState<any>({
    file: null,
    base64URL: '',
  });

  const dispatch = useDispatch();

  const decoded = useQrDecode(state.base64URL);

  const getBase64 = (file: any) => {
    return new Promise((resolve) => {
      let baseURL = '';
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { file } = state;
    file = e.target.files[0];
    getBase64(file)
      .then((result) => {
        file['base64'] = result;
        setState({
          base64URL: result,
          file,
        });
      })
      .catch((error) => {
        console.error(error);
      });

    setState({
      file: e.target.files[0],
    });
  };

  useEffect(() => {
    if (decoded) {
      dispatch(
        editQrData({
          objectId: selectedObject?.id,
          objectTypeId: selectedObject?.objectType?.id,
          data: JSON.stringify(decoded),
        }),
      );
      closeAllOverlays();
    }
  }, [decoded]);

  const onScan = (data: string) => {
    try {
      if (data) {
        dispatch(
          editQrData({
            objectId: selectedObject?.id,
            objectTypeId: selectedObject?.objectType?.id,
            data,
          }),
        );
        closeAllOverlays();
      }
    } catch (error) {
      console.error('Error while scanning QR code', error);
    }
  };

  return (
    <>
      <input
        type="file"
        id="file"
        accept={'image/*'}
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={inputChangeHandler}
      />
      <Select
        options={[
          {
            label: 'Upload',
            value: 'upload',
          },
          {
            label: 'Scan',
            value: 'scan',
          },
        ]}
        onChange={(option: any) => {
          if (option.value === 'upload') {
            fileRef?.current?.click();
          } else if (option.value === 'scan') {
            dispatch(
              openOverlayAction({
                type: OverlayNames.QR_SCANNER,
                props: { onSuccess: onScan },
              }),
            );
          }
        }}
        menuPlacement="top"
        style={{ width: 150 }}
        defaultValue={{ label: 'Modify', value: 'modify' }}
        formatOptionLabel={(option, { context }) =>
          context === 'value' ? <div>Modify</div> : option.label
        }
        isSearchable={false}
      />
    </>
  );
};
