import ReactPdf, { StyleSheet, Text, View } from '@react-pdf/renderer';
import React, { ReactNode } from 'react';

interface TableColumn {
  customStyle?: ReactPdf.Style;
  text: string | ReactNode;
}

interface TableRowProps extends ReactPdf.ViewProps {
  columns: TableColumn[];
  customStyle?: ReactPdf.Style;
}

const styles = StyleSheet.create({
  tableRow: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },

  tableColumn: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    fontSize: 10,
    fontWeight: 'normal',
    paddingHorizontal: 4,
    paddingVertical: 8,
    textAlign: 'right',
  },
});

const TableRow = ({
  columns,
  customStyle = {},
  fixed = false,
  break: breakView = false,
}: TableRowProps) => (
  <View break={breakView} fixed={fixed} style={[styles.tableRow, customStyle]}>
    {columns.map(({ text, customStyle = {} }, index) =>
      typeof text === 'string' ? (
        <Text
          key={`${text}-${index}`}
          style={[styles.tableColumn, customStyle]}
        >
          {text}
        </Text>
      ) : (
        text
      ),
    )}
  </View>
);

export default TableRow;
