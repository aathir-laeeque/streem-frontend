import { StyleSheet } from '@react-pdf/renderer';

export const commonPdfStyles = StyleSheet.create({
  page: {
    backgroundColor: '#FFF',
  },
  container: {
    paddingHorizontal: 20,
    gap: 8,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  flexGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  link: {
    color: 'blue',
    fontSize: 10,
    fontWeight: 300,
  },
  input: {
    height: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#666666',
    width: '100%',
  },
  card: {
    borderColor: '#000',
    borderRadius: 4,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    borderWidth: 1,
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
  },
  cardHeader: {
    backgroundColor: '#000',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cardBody: {
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

export const auditLogStyles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
  },
  sectionHeader: {
    color: '#666666',
    fontWeight: 700,
    paddingVertical: 8,
  },
  sectionBody: {
    borderLeftColor: '#bababa',
    borderLeftStyle: 'dashed',
    borderLeftWidth: 1,
  },
  circle: {
    marginLeft: -4,
    backgroundColor: '#bababa',
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  logRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },
  logInfo: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10,
    color: '#080606',
    marginLeft: 8,
    flexWrap: 'wrap',
  },
});
