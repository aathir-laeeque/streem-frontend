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
};

const Wrapper = styled.div.attrs({
  className: 'upload-image',
})`
  > div {
    align-items: center;
    cursor: pointer;
    display: flex;

    .icon:only-child {
      margin: 0 !important;
    }
  }
`;

const ImageUploadButton: FC<ImageUploadButtonProps> = ({
  icon: Icon = ImageUploadIcon,
  label,
  onUploadError,
  onUploadSuccess,
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

  return (
    <Wrapper>
      <input
        type="file"
        id="file"
        ref={fileRef}
        style={{ display: 'none' }}
        onChange={(event) => {
          event.stopPropagation();
          event.preventDefault();
          setFile((event?.target?.files ?? [])[0]);
        }}
      />

      <div onClick={() => fileRef?.current?.click()}>
        <Icon className="icon" />
        {label ? <span>{label}</span> : null}
      </div>
    </Wrapper>
  );
};

export default ImageUploadButton;
