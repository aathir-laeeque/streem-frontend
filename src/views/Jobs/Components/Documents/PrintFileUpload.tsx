import { setKeepPersistedData } from '#utils';
import React, { FC, useEffect } from 'react';

const PrintFileUpload: FC<any> = ({ location: { search } }) => {
  const urlParams = new URLSearchParams(search);
  const mediaLink = urlParams?.get('link');

  useEffect(() => {
    setKeepPersistedData();
  }, []);

  return (
    <>
      <iframe
        src={`https://docs.google.com/viewer?url=${mediaLink}&embedded=true`}
        width="100%"
        height="100%"
        frameborder="0"
      ></iframe>
    </>
  );
};

export default PrintFileUpload;
