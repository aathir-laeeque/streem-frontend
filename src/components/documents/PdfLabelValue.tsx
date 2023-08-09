import { View, StyleSheet } from '@react-pdf/renderer';
import { ReactNode } from 'react';
import { PdfText } from './PdfText';
import React from 'react';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    gap: 4,
  },
  label: {
    fontWeight: 600,
    color: '#666666',
    textTransform: 'capitalize',
    minWidth: '33%',
    fontSize: 10,
  },
});

interface Props {
  label: string;
  value: string | ReactNode;
  inline?: boolean;
  bordered?: boolean;
}

export const PdfLabelGroup = ({ label, value, inline = true, bordered = true }: Props) => (
  <View
    style={{
      ...styles.wrapper,
      ...(inline && {
        flexDirection: 'row',
        alignItems: 'center',
      }),
    }}
    wrap={false}
  >
    <PdfText style={styles.label}>{label}:</PdfText>
    <View
      style={{
        borderWidth: bordered ? 1 : 0,
        paddingHorizontal: 4,
        flex: inline ? 1 : undefined,
      }}
    >
      {typeof value === 'string' ? <PdfText>{value}</PdfText> : value}
    </View>
  </View>
);
