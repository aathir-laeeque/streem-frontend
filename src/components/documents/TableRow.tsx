import ReactPdf, { StyleSheet, View } from '@react-pdf/renderer';
import { Style } from '@react-pdf/types';
import React, { ReactNode } from 'react';
import { PdfText } from './PdfText';

interface TableColumn {
  customStyle?: Style;
  text: string | ReactNode;
}

interface TableRowProps extends ReactPdf.ViewProps {
  columns: TableColumn[];
  customStyle?: Style;
}

const styles = StyleSheet.create({
  tableRow: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#dadada',
  },

  tableColumn: {
    alignItems: 'center',
    display: 'flex',
    fontSize: 10,
    fontWeight: 'normal',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderColor: '#dadada',
    height: '100%',
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

export const TableRow = ({
  columns,
  customStyle = {},
  fixed = false,
  break: breakView = false,
}: TableRowProps) => (
  <View break={breakView} fixed={fixed} style={{ ...styles.tableRow, ...customStyle }}>
    {columns.map(({ text, customStyle = {} }, index) =>
      typeof text === 'string' ? (
        <PdfText
          key={`${text}-${index}`}
          style={{ ...styles.tableColumn, ...customStyle }}
          hyphenationCallback={(e) => breakWord(e)}
        >
          {text}
        </PdfText>
      ) : (
        text
      ),
    )}
  </View>
);
