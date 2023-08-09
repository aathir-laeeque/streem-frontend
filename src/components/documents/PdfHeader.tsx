import logo from '#assets/images/logo.png';
import { Image, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';

export const pdfHeaderStyles = StyleSheet.create({
  header: {
    backgroundColor: '#eeeeee',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 2,
    width: '100%',
    marginBottom: 8,
    height: 34,
  },

  image: {
    height: 24,
  },
});

interface Props {
  logoUrl?: string;
}

export const PdfHeader = ({ logoUrl }: Props) => (
  <View fixed style={pdfHeaderStyles.header}>
    {logoUrl && <Image src={logoUrl} style={pdfHeaderStyles.image} />}
    <Image src={logo} style={pdfHeaderStyles.image} />
  </View>
);
