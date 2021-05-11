import ReactPdf, { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

import { CWEDetails } from '../Summary/types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    borderRadius: 4,
    marginTop: 24,
    paddingBottom: 24,
  },

  title: {
    backgroundColor: '#000',
    borderTopLeftRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'left',
    padding: 4,
    width: 250,
  },

  text: {
    color: '#333',
    fontSize: 12,
    fontWeight: 600,
    textAlign: 'left',
  },

  wrapper: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

interface CWEReasonProps extends CWEDetails, ReactPdf.ViewProps {}

const CWEReason = ({ comment, medias, reason }: CWEReasonProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>
      This Job is completed with Exception reason
    </Text>

    <View style={styles.wrapper}>
      <Text style={styles.text}>Reason for Exception</Text>
      <Text style={[styles.text, { marginTop: 8 }]}>{reason}</Text>
    </View>

    {comment ? (
      <View style={styles.wrapper}>
        <Text style={styles.text}>Additional Comments</Text>
        <Text style={[styles.text, { marginTop: 8 }]}>{comment}</Text>
      </View>
    ) : null}

    {medias.length ? (
      <View style={[styles.wrapper, { paddingBottom: 0 }]}>
        <Text style={styles.text}>Link to attached Document</Text>

        {medias.map((media) => (
          <Link
            key={media.id}
            src={media.link}
            style={[styles.text, { marginTop: 8 }]}
          >
            {media.link}
          </Link>
        ))}
      </View>
    ) : null}
  </View>
);

export default CWEReason;
