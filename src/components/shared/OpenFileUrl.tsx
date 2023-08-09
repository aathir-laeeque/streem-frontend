import { setKeepPersistedData } from '#utils';
import React, { FC, useEffect } from 'react';

export const OpenFileUrl: FC<any> = ({ location: { search } }) => {
  const urlParams = new URLSearchParams(search);
  const mediaLink = urlParams?.get('link');

  useEffect(() => {
    setKeepPersistedData();
  }, []);

  return (
    <iframe
      src={`https://docs.google.com/viewer?url=${mediaLink}&embedded=true`}
      width="100%"
      height="100%"
      frameBorder="0"
    ></iframe>
  );
};
