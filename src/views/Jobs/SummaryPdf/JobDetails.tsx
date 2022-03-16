import { getUserName } from '#services/users';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { JobSummary } from '../Summary/types';
import InputGroup from './InputGroup';

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
    width: 180,
  },
});

type Props = Pick<
  JobSummary,
  'code' | 'completedBy' | 'createdBy' | 'properties'
>;

const JobDetails = ({ code, completedBy, createdBy, properties }: Props) => (
  <View style={styles.container}>
    <Text style={styles.title}>Job Details</Text>

    {/* Job details outside of properties comes here */}
    <InputGroup
      customStyles={{ marginTop: 8 }}
      label="Job Created By"
      value={getUserName({ user: createdBy, withEmployeeId: true })}
    />

    <InputGroup
      label="Job Completed By"
      value={getUserName({ user: completedBy, withEmployeeId: true })}
    />

    <InputGroup label="Job ID" value={code} />

    {/* render all the properties of the job */}
    {Object.values(properties).map((prop) => (
      <InputGroup key={prop.name} label={prop.label} value={prop.value} />
    ))}
  </View>
);

export default JobDetails;
