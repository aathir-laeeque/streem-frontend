import ReactPdf, { Text } from '@react-pdf/renderer';
import React from 'react';

export const PdfText: React.FC<ReactPdf.TextProps> = ({ style, children, ...rest }) => (
  <Text {...rest} style={{ fontFamily: 'Nunito', fontSize: 12, ...style }}>
    {children}
  </Text>
);
