import styled from 'styled-components';
import { StyleSheet, Font } from '@react-pdf/renderer';
import NunitoRegular from '../../../assets/fonts/nunito/nunito-v14-latin-300.ttf';
import NunitoBold from '../../../assets/fonts/nunito/nunito-v14-latin-700.ttf';

export const LoadingDiv = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

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
    paddingBottom: 50,
    paddingTop: 45,
    textOverflow: 'hidden',
  },
  header: {
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: '0',
  },
  mainHeader: {
    backgroundColor: '#FFF',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    marginTop: -45,
    zIndex: 10,
  },
  footer: {
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    bottom: '0',
  },
  footerInfo: {
    fontSize: 10,
    color: '#000000',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  container: {
    paddingHorizontal: 40,
    paddingVertical: 8,
  },
  pageInfo: {
    borderRadius: 4,
    backgroundColor: '#bababa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    padding: '2px 4px',
  },
  stageHeader: {
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingVertical: 16,
  },
  clientLogoWrapper: {
    backgroundColor: '#999999',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  text12: {
    fontSize: 12,
    fontFamily: 'Nunito',
  },
});
