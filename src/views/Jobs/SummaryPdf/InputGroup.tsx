import ReactPdf, { StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

interface InputGroupProps extends ReactPdf.ViewProps {
  customStyles?: ReactPdf.Style;
  customLabelStyles?: ReactPdf.Style;
  customValueStyles?: ReactPdf.Style;
  label: string;
  value: string;
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 24,
  },

  label: {
    color: '#333',
    flex: 1,
    fontSize: 12,
    fontWeight: 'normal',
    marginRight: 8,
    textAlign: 'right',
  },

  value: {
    borderWidth: 1,
    borderColor: '#000',
    flex: 2,
    fontSize: 12,
    fontWeight: 'normal',
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'left',
  },
});

const InputGroup = ({
  customLabelStyles = {},
  customStyles = {},
  customValueStyles = {},
  label,
  value,
}: InputGroupProps) => (
  <View style={[styles.row, customStyles]}>
    <Text style={[styles.label, customLabelStyles]}>{label}</Text>

    <Text style={[styles.value, customValueStyles]}>{value}</Text>
  </View>
);
export default InputGroup;
