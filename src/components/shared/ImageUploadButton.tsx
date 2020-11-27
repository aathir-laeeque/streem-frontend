import ImageUploadIcon from '#assets/svg/ImageUpload';
import { apiUploadFile } from '#utils/apiUrls';
import { FileUploadData } from '#utils/globalTypes';
import { request } from '#utils/request';
import { SvgIconComponent } from '@material-ui/icons';
import React, { createRef, FC, useEffect, useState } from 'react';
import styled from 'styled-components';

type ImageUploadButtonProps = {
  icon?: SvgIconComponent;
  label?: string;
  onUploadSuccess: (data: FileUploadData) => void;
  onUploadError: (error: any) => void;
  disabled?: boolean;
  allowCapture?: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'upload-image',
})<Pick<ImageUploadButtonProps, 'disabled'>>`
  > div {
    align-items: center;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    display: flex;

    .icon:only-of-type {
      cursor: ${({ disabled }) =>
        disabled ? 'not-allowed' : 'pointer'} !important;
    }
  }
`;

const ImageUploadButton: FC<ImageUploadButtonProps> = ({
  disabled = false,
  icon: Icon = ImageUploadIcon,
  label,
  onUploadError,
  onUploadSuccess,
  allowCapture = false,
}) => {
  const [file, setFile] = useState<File | null>(null);

  const fileRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if (file) {
      (async () => {
        const formData = new FormData();
        formData.append('file', file);

        const { data, errors } = await request('POST', apiUploadFile(), {
          formData,
        });

        if (data) {
          onUploadSuccess(data);
        } else {
          onUploadError(errors);
        }
      })();
    }
  }, [file]);

  const extraProps = allowCapture ? { capture: 'environment' } : {};

  return (
    <Wrapper disabled={disabled}>
      <input
        type="file"
        id="file"
        accept="image/*"
        ref={fileRef}
        {...extraProps}
        style={{ display: 'none' }}
        onChange={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setFile((event?.target?.files ?? [])[0]);
        }}
      />

      <div
        onClick={() => {
          console.log('disabled == ', disabled);
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
