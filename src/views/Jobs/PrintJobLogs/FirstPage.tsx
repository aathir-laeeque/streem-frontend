import { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { commonStyles, InlineInputLabelGroup, TabLookLike } from '../Components/Documents/utils';

const assigneStyles = StyleSheet.create({
  assigneWrapper: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
    width: '100%',
    margin: 'auto',
  },
  assigneRow: {
    flexDirection: 'row',
    display: 'flex',
    marginTop: '4px',
  },
  assigneHeading: {
    fontSize: 10,
    fontFamily: 'Nunito',
    textAlign: 'center',
    paddingVertical: 5,
  },
  assignView: {
    display: 'flex',
    flex: 1,
  },
  assigneInput: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 3,
    paddingHorizontal: 8,
    height: 25,
    width: '24%',
  },
});

enum ConstraintVisual {
  LT = 'is less than', // Date and Number
  GT = 'is greater than', // Date and Number
  LTE = 'is less than equal to', // Date and Number
  GTE = 'is greater than equal to', // Date and Number
  NE = 'is not equal to', // Date and Number
  MIN = 'is minimum', // String Length or Choice Count
  MAX = 'is maximum', // String Length or Choice Count
  PATTERN = 'is like',
  EQ = 'is equal to',
}

export const FirstPage = ({
  filters,
  log,
  showProcessSection,
  checklist,
}: {
  filters: Record<string, any>;
  showProcessSection: boolean;
  log?: any;
  checklist: any;
}) => {
  return (
    <View style={{ paddingHorizontal: 40, paddingVertical: 8 }}>
      <Text style={{ fontSize: 30 }}>Job Logs</Text>

      {log && showProcessSection && (
        <TabLookLike title="Process Details">
          <View>
            <InlineInputLabelGroup label="Process Name" value={log.checklistName} />
            <InlineInputLabelGroup label="Process ID" value={log.checklistCode} />
            {checklist.properties?.map((property) => (
              <InlineInputLabelGroup
                label={`${property.label}:`}
                value={property.value || '-'}
                key={property.id}
              />
            ))}
          </View>
        </TabLookLike>
      )}
      {!!Object.values(filters).length && (
        <TabLookLike title="Filters Applied">
          <View style={[assigneStyles.assigneWrapper, { alignItems: 'flex-start' }]}>
            <View style={assigneStyles.assignView}>
              {Object.values(filters).map((currField, index) => {
                return (
                  <View style={assigneStyles.assigneRow} wrap={false}>
                    <Text style={{ ...assigneStyles.assigneHeading, width: '12%' }}>
                      Filter {index + 1} - Where:
                    </Text>
                    <View style={assigneStyles.assigneInput}>
                      <Text style={commonStyles.text12}>{currField.label}</Text>
                    </View>
                    <Text style={{ ...assigneStyles.assigneHeading, width: '8%' }}>Condition:</Text>
                    <View style={assigneStyles.assigneInput}>
                      <Text style={commonStyles.text12}>
                        {ConstraintVisual[currField.op as keyof typeof ConstraintVisual]}
                      </Text>
                    </View>
                    <Text style={{ ...assigneStyles.assigneHeading, width: '6%' }}>Value:</Text>
                    <View style={assigneStyles.assigneInput}>
                      <Text style={commonStyles.text12}>{currField.value}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </TabLookLike>
      )}
    </View>
  );
};
