import { useState, useEffect } from 'react';
import QrcodeDecoder from 'qrcode-decoder/dist/index';

const useQrDecode = (data: string, options: object = {}) => {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const qr = new QrcodeDecoder();
      qr.decodeFromImage(data, options).then((res: { readonly data: string }) => {
        setText(res.data);
      });
    }
  }, [data, options]);

  return text;
};

export default useQrDecode;
