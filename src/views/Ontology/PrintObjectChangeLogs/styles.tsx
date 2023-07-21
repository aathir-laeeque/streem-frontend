import NunitoBold from '../../../assets/fonts/nunito/nunito-v14-latin-700.ttf';
import NunitoRegular from '../../../assets/fonts/nunito/nunito-v14-latin-300.ttf';
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
    paddingHorizontal: 16,
  },

  table: {
    backgroundColor: '#f4f4f4',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Nunito',
    overflow: 'hidden',
  },
});
