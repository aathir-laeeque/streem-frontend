import { StyleSheet } from '@react-pdf/renderer';
import styled from 'styled-components';

export const LoadingDiv = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

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
    paddingTop: 16,
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
    marginVertical: 20,
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
  columns: {
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
  },
  logHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  headerItemText: {
    fontSize: 12,
    marginRight: 8,
    fontFamily: 'Nunito',
    color: '#666666',
  },
  logRow: {
    marginVertical: 10,
    paddingHorizontal: 11,
    borderLeftColor: '#bababa',
    borderLeftStyle: 'dashed',
    borderLeftWidth: 1,
  },
  logItem: {
    display: 'flex',
    marginVertical: 5,
    flexDirection: 'row',
  },
  circle: {
    marginLeft: -16,
    marginTop: 3,
    backgroundColor: '#bababa',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  content: {
    marginLeft: 16,
    display: 'flex',
    flexDirection: 'row',
  },
  contentItems: {
    display: 'flex',
    fontSize: 10,
    color: '#666666',
    marginRight: 8,
    fontFamily: 'Nunito',
  },
});
