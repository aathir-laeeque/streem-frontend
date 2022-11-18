import { Parameter } from '#JobComposer/checklist.types';
import { Text, View } from '@react-pdf/renderer';
import React from 'react';
import { styles } from './ActivityList';

const MemoResourceParameter = ({ parameter }: { parameter: Parameter }) => {
  const selectedOption = parameter.response?.choices?.length
    ? parameter.response.choices.map((choice) => choice.objectDisplayName).join(', ')
    : undefined;

  return (
    <View style={styles.parameterView}>
      <View
        style={[
          styles.materialParameterItems,
          {
            justifyContent: 'flex-start',
            borderBottomWidth: 0,
            paddingTop: 2,
          },
        ]}
        wrap={false}
      >
        <Text style={styles.parameterHintText}>{parameter.label}</Text>
      </View>
      {selectedOption ? (
        <Text style={styles.text12}>{selectedOption}</Text>
      ) : (
        <Text style={styles.text12}>______________________________________</Text>
      )}
    </View>
  );
};

const ResourceParameter = React.memo(MemoResourceParameter);

export default ResourceParameter;
