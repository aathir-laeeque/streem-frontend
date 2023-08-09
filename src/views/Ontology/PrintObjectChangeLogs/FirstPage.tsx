import { PdfLabelGroup, PdfTab, PdfText } from '#components/documents';
import { StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';

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
  objectDetails,
}: {
  filters: Record<string, any>;
  objectDetails: Record<string, string>;
}) => {
  return (
    <View style={{ paddingHorizontal: 40, paddingVertical: 8 }}>
      <PdfText style={{ fontSize: 30 }}>Audit Logs</PdfText>

      {!!Object.values(objectDetails).length && (
        <PdfTab title="Object Details">
          <View style={{ gap: 8 }}>
            <PdfLabelGroup label="Object Type" value={objectDetails?.objectTypeDisplayName} />
            <PdfLabelGroup label="Object Name" value={objectDetails?.objectDisplayName} />
            <PdfLabelGroup label="ID" value={objectDetails?.objectExternalId} />
          </View>
        </PdfTab>
      )}
      {!!Object.values(filters).length && (
        <PdfTab title="Filters Applied">
          <View style={[assigneStyles.assigneWrapper, { alignItems: 'flex-start' }]}>
            <View style={assigneStyles.assignView}>
              {Object.values(filters).map((currField, index) => {
                return (
                  <View style={assigneStyles.assigneRow} wrap={false}>
                    <PdfText style={{ ...assigneStyles.assigneHeading, width: '12%' }}>
                      Filter {index + 1} - Where:
                    </PdfText>
                    <View style={assigneStyles.assigneInput}>
                      <PdfText>{currField.label}</PdfText>
                    </View>
                    <PdfText style={{ ...assigneStyles.assigneHeading, width: '8%' }}>
                      Condition:
                    </PdfText>
                    <View style={assigneStyles.assigneInput}>
                      <PdfText>
                        {ConstraintVisual[currField.op as keyof typeof ConstraintVisual]}
                      </PdfText>
                    </View>
                    <PdfText style={{ ...assigneStyles.assigneHeading, width: '6%' }}>
                      Value:
                    </PdfText>
                    <View style={assigneStyles.assigneInput}>
                      <PdfText>{currField.value}</PdfText>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </PdfTab>
      )}
    </View>
  );
};
