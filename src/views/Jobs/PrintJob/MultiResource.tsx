import { Parameter } from '#JobComposer/checklist.types';
import { Text, View } from '@react-pdf/renderer';
import React from 'react';
import { styles } from './ActivityList';

const MemoMultiResourceParameter = ({ parameter }: { parameter: Parameter }) => {
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
      {parameter.response?.choices?.length ? (
        parameter?.response?.choices?.map((item) => (
          <View
            key={`${item.objectId}`}
            style={[
              styles.materialParameterItems,
              { justifyContent: 'flex-start', borderBottomWidth: 0 },
            ]}
            wrap={false}
          >
            <Text style={styles.text12}>{item.objectDisplayName}</Text>
          </View>
        ))
      ) : (
        <View>
          <Text style={styles.text12}>______________________________________</Text>
          <Text style={styles.text12}>______________________________________</Text>
        </View>
      )}
    </View>
  );
};

const MultiResourceParameter = React.memo(MemoMultiResourceParameter);

export default MultiResourceParameter;
