import cleenLogo from '#assets/images/cleen.png';
import { Image, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  mainHeader: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 16,
  },

  image: {
    height: 24,
  },
});

interface Props {
  logoUrl: string;
}

const Header = ({ logoUrl }: Props) => (
  <View fixed style={styles.mainHeader}>
    <Image src={logoUrl} style={styles.image} />
    <Image src={cleenLogo} style={styles.image} />
  </View>
);

export default Header;
