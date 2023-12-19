import { StyleSheet, View } from '@react-pdf/renderer';
import React, { FC } from 'react';
import { PdfText } from './PdfText';

export const tableStyles = StyleSheet.create({
  root: {
    display: 'flex',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#000',
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  columnText: {
    fontSize: 10,
    fontWeight: 300,
  },
  headerText: {
    fontSize: 11,
    fontWeight: 700,
  },
  variationHeaderText: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4,
  },
  flexWrapContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10,
  },
  commentsRow: {
    height: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#666666',
    width: '100%',
  },
});

type TPdfTable = {
  data: Array<Record<string, any>>;
  columns: Array<Record<string, any>>;
};

export const PdfTable: FC<TPdfTable> = ({ data, columns }) => {
  return (
    <View style={tableStyles.root}>
      <View style={tableStyles.row} fixed>
        {columns.map((column) => (
          <View style={tableStyles.column} key={column.id}>
            <PdfText style={tableStyles.headerText}>{column.name}</PdfText>
          </View>
        ))}
      </View>

      {data.map((row) => {
        return (
          <View style={tableStyles.row} key={row.id}>
            {columns.map((column) => {
              return (
                <View style={tableStyles.column} key={row.id + column.id}>
                  {typeof row[column.id] === 'string' ? (
                    <PdfText style={tableStyles.columnText}>{row[column.id]}</PdfText>
                  ) : (
                    row[column.id](column)
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};
