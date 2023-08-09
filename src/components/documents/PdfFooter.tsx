import { ALL_FACILITY_ID } from '#utils/constants';
import { formatDateTime } from '#utils/timeUtils';
import { StyleSheet, View } from '@react-pdf/renderer';
import { getUnixTime } from 'date-fns';
import React, { FC } from 'react';
import { PdfText } from './PdfText';

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 'auto',
  },
  footer: {
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
  },
  footerInfo: {
    fontSize: 10,
    color: '#000000',
  },
  pageInfo: {
    borderRadius: 4,
    backgroundColor: '#bababa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    padding: '2px 4px',
  },
});

export const PdfFooter: FC<{
  dateAndTimeStampFormat: string;
  selectedFacility: any;
  profile: any;
  pageInfo?: boolean;
}> = ({ selectedFacility, dateAndTimeStampFormat, profile, pageInfo = true }) => {
  return (
    <View fixed style={styles.footerContainer}>
      <View style={styles.footer}>
        <PdfText style={styles.footerInfo}>
          Downloaded on{' '}
          {formatDateTime({ value: getUnixTime(new Date()), format: dateAndTimeStampFormat })}. By{' '}
          {profile.firstName} {profile.lastName} ID: {profile.employeeId} for{' '}
          {selectedFacility!.id !== ALL_FACILITY_ID ? 'Facility: ' : ''}
          {selectedFacility?.name} using Leucine App
        </PdfText>
        {pageInfo && (
          <View style={styles.pageInfo}>
            <PdfText
              style={{ fontSize: 10, minHeight: 10 }}
              render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
              fixed
            />
          </View>
        )}
      </View>
    </View>
  );
};
