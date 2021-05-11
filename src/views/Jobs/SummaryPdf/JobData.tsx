import { formatDateTime, formatDuration1 } from '#utils/timeUtils';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { JobSummary } from '../Summary/types';

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },

  card: {
    borderColor: '#000',
    borderRadius: 4,
    borderWidth: 1,
    display: 'flex',
    flex: 1,
    marginRight: 8,
  },

  cardHeader: {
    backgroundColor: '#000',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    padding: 4,
    textAlign: 'left',
  },

  cardBody: {
    color: '#000',
    fontSize: 12,
    fontWeight: 600,
    padding: 8,
    textAlign: 'left',
  },

  lastChild: {
    marginRight: 0,
  },
});

type Props = Pick<
  JobSummary,
  'endedAt' | 'startedAt' | 'totalDuration' | 'totalTaskExceptions'
>;

const JobData = ({
  endedAt,
  startedAt,
  totalDuration,
  totalTaskExceptions,
}: Props) => (
  <View style={styles.row}>
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Job Started On</Text>

      <Text style={styles.cardBody}>
        {startedAt ? formatDateTime(startedAt, 'D MMM YYYY, hh:mm A') : 'N/A'}
      </Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardHeader}>Job Completed On</Text>

      <Text style={styles.cardBody}>
        {endedAt ? formatDateTime(endedAt, 'D MMM YYYY, hh:mm A') : 'N/A'}
      </Text>
    </View>

    <View style={styles.card}>
      <Text style={styles.cardHeader}>Job Duration</Text>

      <Text style={styles.cardBody}>
        {totalDuration ? formatDuration1({ duration: totalDuration }) : 'N/A'}
      </Text>
    </View>

    <View style={[styles.card, styles.lastChild]}>
      <Text style={styles.cardHeader}>Total Exceptions</Text>

      <Text style={styles.cardBody}>{totalTaskExceptions}</Text>
    </View>
  </View>
);

export default JobData;
