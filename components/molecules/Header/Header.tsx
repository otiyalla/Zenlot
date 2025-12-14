import React from 'react';
import { View, StyleSheet, ImageSourcePropType } from 'react-native';
import { Text, Logo } from '@/components/atoms';

export interface HeaderProps {
  title: string;
  logo?: string | ImageSourcePropType;
  logoSize?: number;
  showLogo?: boolean;
  backgroundColor?: string;
  textColor?: string;
  testID?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  logo,
  logoSize = 35,
  showLogo = true,
  backgroundColor,
  textColor,
  testID,
}) => {
  const headerStyle = [
    styles.header,
    backgroundColor && { backgroundColor },
  ];

  const titleStyle = [
    styles.title,
    textColor && { color: textColor },
  ];

  return (
    <View style={headerStyle} testID={testID}>
      {showLogo && (
        <Logo 
          style={[styles.logo, { width: logoSize, height: logoSize }]}
        />
      )}
      <Text 
        variant="heading" 
        weight="bold" 
        style={titleStyle}
        testID="header-text"
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 16,
    //backgroundColor: '#FFFFFF',
  },
  logo: {
    borderRadius: 30,
    marginRight: 12,
  },
  title: {
    flex: 1,
  },
});

