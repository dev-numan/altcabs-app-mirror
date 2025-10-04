import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CustomerBookingViewSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder 
        borderRadius={16}
        backgroundColor="#1a2332"
        highlightColor="#2a3442">
        <SkeletonPlaceholder.Item
          marginHorizontal={16}
          marginVertical={8}
          borderRadius={16}
          padding={16}>
          {/* Header with badge, ref, and status */}
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={16}>
            {/* Number badge */}
            <SkeletonPlaceholder.Item width={36} height={36} borderRadius={18} marginRight={12} />
            {/* Ref and status */}
            <SkeletonPlaceholder.Item flex={1}>
              <SkeletonPlaceholder.Item width={120} height={16} borderRadius={4} />
              <SkeletonPlaceholder.Item width={80} height={12} borderRadius={4} marginTop={6} />
            </SkeletonPlaceholder.Item>
            {/* Chevron */}
            <SkeletonPlaceholder.Item width={24} height={24} borderRadius={4} />
          </SkeletonPlaceholder.Item>

          {/* Route section */}
          <SkeletonPlaceholder.Item marginBottom={16}>
            {/* From location */}
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="flex-start">
              <SkeletonPlaceholder.Item width={20} height={20} borderRadius={4} />
              <SkeletonPlaceholder.Item flex={1} marginLeft={12}>
                <SkeletonPlaceholder.Item width={40} height={10} borderRadius={4} marginBottom={4} />
                <SkeletonPlaceholder.Item width="90%" height={14} borderRadius={4} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>

            {/* Dotted line */}
            <SkeletonPlaceholder.Item 
              width={2} 
              height={20} 
              borderRadius={1} 
              marginLeft={10}
              marginVertical={4}
            />

            {/* To location */}
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="flex-start">
              <SkeletonPlaceholder.Item width={20} height={20} borderRadius={4} />
              <SkeletonPlaceholder.Item flex={1} marginLeft={12}>
                <SkeletonPlaceholder.Item width={30} height={10} borderRadius={4} marginBottom={4} />
                <SkeletonPlaceholder.Item width="85%" height={14} borderRadius={4} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>

          {/* Divider */}
          <SkeletonPlaceholder.Item 
            width="100%" 
            height={1} 
            marginBottom={12}
          />

          {/* Footer */}
          <SkeletonPlaceholder.Item 
            flexDirection="row" 
            justifyContent="space-between" 
            alignItems="center">
            {/* Time */}
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item width={16} height={16} borderRadius={4} />
              <SkeletonPlaceholder.Item width={100} height={13} borderRadius={4} marginLeft={6} />
            </SkeletonPlaceholder.Item>
            {/* Price tag */}
            <SkeletonPlaceholder.Item 
              width={70} 
              height={28} 
              borderRadius={8}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
});

export default CustomerBookingViewSkeleton;
