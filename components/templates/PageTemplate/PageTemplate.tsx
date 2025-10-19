import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Header } from '@/components/molecules';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from '@/components/atoms';

export interface PageTemplateProps {
  title: string;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollable?: boolean;
  backgroundColor?: string;
  showHeader?: boolean;
  headerProps?: any;
  testID?: string;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  title,
  children,
  header,
  footer,
  refreshing = false,
  onRefresh = () => {},
  scrollable = true,
  backgroundColor,
  showHeader = true,
  headerProps,
  testID,
}) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const pageStyle = [
    styles.page,
    { backgroundColor: backgroundColor || theme.background },
  ];

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background}]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
      
        >
          {children}
        </ScrollView>
      );
    }
    return <View style={styles.content}>{children}</View>;
  };

  return (
    <SafeAreaView style={pageStyle} testID={testID}>
      {showHeader && (
        header || <Header title={title} {...headerProps} />
      )}
      
      <View style={styles.body}>
        {renderContent()}
      </View>
      
      {footer && (
        <View style={[styles.footer, { borderTopColor: theme.borderColor, backgroundColor: theme.background }]}>
          {footer}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    //backgroundColor: theme.background
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});

