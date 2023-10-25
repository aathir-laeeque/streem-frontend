import { formatDuration } from '#utils/timeUtils';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { JobSummary } from '../Summary/types';
import { styles as baseStyles } from './styles';
import TableRow from './TableRow';

type Props = Pick<JobSummary, 'stages' | 'totalStageDuration' | 'totalTaskExceptions'>;

const isEven = (n: number) => n % 2 === 0;

const styles = StyleSheet.create({
  durationSummary: {
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
    marginTop: 24,
  },

  durationSummaryTitle: {
    backgroundColor: '#000',
    borderTopLeftRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'left',
    padding: 4,
    width: 180,
  },

  totalStageDuration: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    padding: 4,
    textAlign: 'left',
  },
});

const DurationSummary = ({ stages = [], totalStageDuration, totalTaskExceptions }: Props) => (
  <View break style={styles.durationSummary}>
    <View fixed>
      <Text style={styles.durationSummaryTitle}>Duration Summary</Text>

      {stages.length ? (
        <Text style={styles.totalStageDuration}>
          Total Stage Duration : {formatDuration(totalStageDuration ?? 0)}
        </Text>
      ) : null}
    </View>

    {stages.length ? (
      <View style={baseStyles.table}>
        <TableRow
          fixed
          columns={[
            {
              text: 'Stage Name',
              customStyle: {
                color: '#fff',
                flex: 4,
                paddingVertical: 4,
                textAlign: 'left',
              },
            },
            {
              text: 'Stage Duration',
              customStyle: { color: '#fff', paddingVertical: 4, flex: 2 },
            },
            {
              text: 'Task Duration (Avg)',
              customStyle: { color: '#fff', paddingVertical: 4, flex: 2 },
            },
            {
              text: 'Exceptions',
              customStyle: { color: '#fff', paddingVertical: 4, flex: 1 },
            },
          ]}
          customStyle={{ backgroundColor: '#666' }}
        />

        {stages.map((stage, index) => {
          const { averageTaskCompletionDuration, id, name, orderTree, totalDuration } = stage;

          return (
            <TableRow
              columns={[
                {
                  text: `Stage ${orderTree} ${name}`,
                  customStyle: { flex: 4, textAlign: 'left' },
                },
                {
                  text: formatDuration(totalDuration),
                  customStyle: { flex: 2 },
                },
                {
                  text: formatDuration(averageTaskCompletionDuration),
                  customStyle: { flex: 2 },
                },
                {
                  text: stage.totalTaskExceptions.toString() ?? '-',
                  customStyle: { flex: 1 },
                },
              ]}
              customStyle={!isEven(index) ? { backgroundColor: '#fff' } : {}}
              key={id}
            />
          );
        })}

        <TableRow
          columns={[
            {
              text: 'Total',
              customStyle: { flex: 4, textAlign: 'left' },
            },
            {
              text: formatDuration(totalStageDuration ?? 0),
              customStyle: { flex: 2 },
            },
            {
              text: '-',
              customStyle: { flex: 2 },
            },
            {
              text: totalTaskExceptions.toString(),
              customStyle: { flex: 1 },
            },
          ]}
          customStyle={{
            backgroundColor: '#fff',
            borderBottomWidth: 2,
            borderColor: '#000',
            borderTopWidth: 2,
          }}
        />
      </View>
    ) : (
      <Text style={baseStyles.defaultSummaryText}>
        There is no Duration summary. Job was completed with exception
      </Text>
    )}
  </View>
);

export default DurationSummary;
