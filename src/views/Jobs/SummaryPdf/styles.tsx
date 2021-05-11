import NunitoRegular from '#assets/fonts/nunito/nunito-v14-latin-300.ttf';
import NunitoBold from '#assets/fonts/nunito/nunito-v14-latin-700.ttf';
import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Nunito',
  src: NunitoRegular,
});

Font.register({
  family: 'NunitoBold',
  src: NunitoBold,
});

export const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFF',
    paddingBottom: 40,
  },

  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 40,
  },

  title: {
    color: '#000',
    fontFamily: 'Nunito',
    fontSize: 40,
    fontWeight: 300,
  },

  cweTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  table: {
    backgroundColor: '#f4f4f4',
    display: 'flex',
    flexDirection: 'column',
  },

  defaultSummaryText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'normal',
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
});
