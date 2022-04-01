import { Facility } from '#services/commonTypes';
import { getUserName, User } from '#services/users';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import moment from 'moment';
import React from 'react';

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    backgroundColor: '#eeeeee',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 8,
    position: 'absolute',
    width: '100%',
  },

  footerInfo: {
    color: '#000',
    fontSize: 10,
  },

  pageInfo: {
    alignItems: 'center',
    backgroundColor: '#bababa',
    borderRadius: 4,
    display: 'flex',
    fontSize: 10,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});

interface Props {
  user: Pick<User, 'employeeId' | 'firstName' | 'lastName'>;
  selectedFacility: Facility;
}

const Footer = ({ user, selectedFacility }: Props) => {
  const now = moment().format('Do MMM, YYYY, hh:mm a');
  const userName = getUserName({ user, withEmployeeId: true });

  return (
    <View fixed style={styles.footer}>
      <Text style={styles.footerInfo}>
        Downloaded on {now}. By {userName} for {selectedFacility.name} using
        CLEEN App
      </Text>

      <Text
        style={styles.pageInfo}
        render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`}
        fixed
      />
    </View>
  );
};

export default Footer;
