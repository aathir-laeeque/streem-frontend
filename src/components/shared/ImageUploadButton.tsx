import ImageUploadIcon from '#assets/svg/ImageUpload';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { apiUploadFile } from '#utils/apiUrls';
import { FileUploadData } from '#utils/globalTypes';
import { request } from '#utils/request';
import { SvgIconComponent } from '@material-ui/icons';
import React, { createRef, FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

type ImageUploadButtonProps = {
  icon?: SvgIconComponent;
  label?: string;
  onUploadSuccess: (data: FileUploadData) => void;
  onUploadError: (error: string) => void;
  onUploadStart?: () => void;
  disabled?: boolean;
  allowCapture?: boolean;
  acceptedTypes?: string[];
  apiCall?: () => string;
};

const Wrapper = styled.div.attrs({
  className: 'upload-image',
})<Pick<ImageUploadButtonProps, 'disabled'>>`
  > div {
    align-items: center;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    display: flex;

    .icon:only-of-type {
      cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')} !important;
    }
  }
`;

const ImageUploadButton: FC<ImageUploadButtonProps> = ({
  disabled = false,
  icon: Icon = ImageUploadIcon,
  label,
  onUploadError,
  onUploadSuccess,
  onUploadStart,
  allowCapture = false,
  acceptedTypes = ['image/*'],
  apiCall = apiUploadFile,
}) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<Blob | File | null>(null);
  const fileRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (file) {
      (async () => {
        let _file = file;
        if (!(file instanceof File)) {
          _file = new File([file], `file.${file.type.split('/')[1]}`, {
            type: file.type,
            lastModified: new Date().getTime(),
          });
        }
        const formData = new FormData();
        formData.append('file', _file);
        onUploadStart && onUploadStart();
        const res = await request('POST', apiCall(), {
          formData,
        });

        if (res?.data) {
          onUploadSuccess(res?.data);
          setFile(null);
        } else {
          onUploadError(res?.errors);
        }
      })();
    }
  }, [file]);

  return (
    <Wrapper disabled={disabled}>
      <input
        type="file"
        id="file"
        accept={acceptedTypes.join(' ,')}
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setFile((event?.target?.files ?? [])[0]);
          event.currentTarget.value = '';
        }}
        {...(allowCapture && {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            dispatch(
              openOverlayAction({
                type: OverlayNames.WEBCAM_OVERLAY,
                props: { setFile },
              }),
            );
          },
        })}
      />
      <div
        onClick={() => {
          if (!disabled) {
            fileRef?.current?.click();
          }
        }}
      >
        <Icon className="icon" />
        {label ? <span>{label}</span> : null}
      </div>
    </Wrapper>
  );
};

export default ImageUploadButton;
