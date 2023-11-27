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
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#dadada',
  },

  tableColumn: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 10,
    fontWeight: 'normal',
    paddingHorizontal: 4,
    paddingVertical: 8,
    textAlign: 'right',
    borderRightWidth: 1,
    borderColor: '#dadada',
  },
});

const chunkSubstr = (str: string, size: number) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
};

function breakWord(word: string): string[] {
  if (word.length > 12) {
    return chunkSubstr(word, 10);
  } else {
    return [word];
  }
}

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
          hyphenationCallback={(e) => breakWord(e)}
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
