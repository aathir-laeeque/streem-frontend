import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFF',
    paddingBottom: 40,
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 16,
  },

  table: {
    backgroundColor: '#f4f4f4',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Nunito',
  },
});
