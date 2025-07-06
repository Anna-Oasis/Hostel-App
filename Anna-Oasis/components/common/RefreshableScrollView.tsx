import React, { ReactNode } from 'react';
import { ScrollView, RefreshControl, ScrollViewProps } from 'react-native';

interface RefreshableScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  onRefresh: () => void | Promise<void>;
  refreshing: boolean;
  refreshColor?: string;
}

const RefreshableScrollView: React.FC<RefreshableScrollViewProps> = ({
  children,
  onRefresh,
  refreshing,
  refreshColor = '#007AFF',
  ...scrollViewProps
}) => {
  const handleRefresh = async () => {
    await onRefresh();
  };

  return (
    <ScrollView
      {...scrollViewProps}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={refreshColor}
          colors={[refreshColor]}
        />
      }
    >
      {children}
    </ScrollView>
  );
};

export default RefreshableScrollView;
