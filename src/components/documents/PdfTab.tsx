import { PdfText } from '#components/documents';
import { StyleSheet, View } from '@react-pdf/renderer';
import React, { ReactNode } from 'react';

const tabLookLikeStyles = StyleSheet.create({
  tabHeader: {
    display: 'flex',
    flexDirection: 'row',
  },
  tabHeaderText: {
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#000',
    minWidth: 155,
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tabBody: {
    backgroundColor: '#f4f4f4',
    padding: 8,
  },
});

export const PdfTab = ({
  children,
  title,
  wrap = true,
}: {
  children: ReactNode;
  title?: string;
  wrap?: boolean;
}) => (
  <View wrap={wrap}>
    {title && (
      <View style={tabLookLikeStyles.tabHeader}>
        <PdfText style={tabLookLikeStyles.tabHeaderText}>{title}</PdfText>
      </View>
    )}
    <View style={tabLookLikeStyles.tabBody}>{children}</View>
  </View>
);
